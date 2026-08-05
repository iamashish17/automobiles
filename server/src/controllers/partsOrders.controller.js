const mongoose = require('mongoose');
const Part = require('../models/part');
const PartsOrder = require('../models/partsOrder');
const User = require('../models/user');
const { initiatePayment, lookupPayment } = require('../services/khalti.service');

const PAYMENT_SUCCESS_STATUS = 'Completed';
const PAYMENT_FAILED_STATUSES = ['Expired', 'User canceled', 'Failed'];

exports.create = async (req, res) => {
  try {
    if (req.role !== 'user') {
      return res.status(403).json({ error: 'Only customer accounts can buy parts' });
    }

    const { items, customerName, phone, address, notes, returnUrl } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerName || !phone || !address) {
      return res.status(400).json({ error: 'Name, phone and delivery address are required' });
    }

    const requestedItems = items.map((item) => ({
      partId: String(item.partId || ''),
      quantity: Number(item.quantity || 0),
    }));

    if (
      requestedItems.some(
        (item) => !mongoose.Types.ObjectId.isValid(item.partId) || !Number.isInteger(item.quantity) || item.quantity < 1
      )
    ) {
      return res.status(400).json({ error: 'Invalid cart item' });
    }

    const parts = await Part.find({ _id: { $in: requestedItems.map((item) => item.partId) } });
    const partsById = new Map(parts.map((part) => [String(part._id), part]));

    const orderItems = requestedItems.map((item) => {
      const part = partsById.get(item.partId);
      if (!part) {
        throw new Error('A part in your cart is no longer available');
      }
      if (part.stock < item.quantity) {
        throw new Error(`${part.name} only has ${part.stock} in stock`);
      }

      return {
        partId: part._id,
        name: part.name,
        price: part.price,
        quantity: item.quantity,
        imageUrl: part.imageUrl,
      };
    });

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const amountInPaisa = Math.round(total * 100);

    if (amountInPaisa < 1000) {
      return res.status(400).json({ error: 'Khalti payment amount must be at least Rs. 10' });
    }

    const deductedItems = [];
    try {
      for (const item of orderItems) {
        const updated = await Part.findOneAndUpdate(
          { _id: item.partId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true }
        );

        if (!updated) {
          throw new Error(`${item.name} stock changed. Please review your cart.`);
        }

        deductedItems.push(item);
      }
    } catch (stockError) {
      await Promise.all(
        deductedItems.map((item) =>
          Part.findByIdAndUpdate(item.partId, { $inc: { stock: item.quantity } })
        )
      );
      throw stockError;
    }

    let order;
    try {
      order = await PartsOrder.create({
        userId: req.userId,
        items: orderItems,
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        notes: notes ? String(notes).trim() : undefined,
        total,
      });

      const origin = getRequestOrigin(req);
      const khaltiPayment = await initiatePayment({
        return_url: returnUrl || `${origin}/payment/khalti-return`,
        website_url: origin,
        amount: amountInPaisa,
        purchase_order_id: String(order._id),
        purchase_order_name: orderItems.length === 1 ? orderItems[0].name : `${orderItems.length} automobile parts`,
      });

      order.khaltiPidx = khaltiPayment.pidx;
      order.paymentStatus = 'Initiated';
      await order.save();

      return res.status(201).json({
        order,
        pidx: khaltiPayment.pidx,
        payment_url: khaltiPayment.payment_url,
        expires_at: khaltiPayment.expires_at,
        expires_in: khaltiPayment.expires_in,
      });
    } catch (paymentError) {
      await Promise.all(
        orderItems.map((item) =>
          Part.findByIdAndUpdate(item.partId, { $inc: { stock: item.quantity } })
        )
      );

      if (order?._id) {
        await PartsOrder.findByIdAndUpdate(order._id, {
          status: 'cancelled',
          paymentStatus: 'Failed',
          stockReleased: true,
        });
      }

      throw paymentError;
    }
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.verifyKhaltiPayment = async (req, res) => {
  try {
    const pidx = req.body?.pidx || req.query?.pidx;
    if (!pidx) {
      return res.status(400).json({ error: 'pidx is required' });
    }

    const payment = await lookupPayment(pidx);
    const order = await PartsOrder.findOne({ khaltiPidx: pidx });

    if (!order) {
      return res.status(404).json({ error: 'Order not found for this payment' });
    }

    if (payment.total_amount !== Math.round(order.total * 100)) {
      return res.status(400).json({ error: 'Payment amount does not match this order' });
    }

    const paymentStatus = normalizePaymentStatus(payment.status);
    order.paymentStatus = paymentStatus;
    order.khaltiTransactionId = payment.transaction_id || order.khaltiTransactionId;
    order.khaltiFee = Number(payment.fee || 0);
    order.khaltiRefunded = Boolean(payment.refunded);

    if (paymentStatus === PAYMENT_SUCCESS_STATUS) {
      order.status = order.status === 'pending' ? 'confirmed' : order.status;
    } else if (PAYMENT_FAILED_STATUSES.includes(paymentStatus)) {
      order.status = 'cancelled';
      await releaseOrderStock(order);
    }

    await order.save();

    return res.json({
      order,
      payment: {
        pidx: payment.pidx,
        status: paymentStatus,
        total_amount: payment.total_amount,
        transaction_id: payment.transaction_id,
        fee: payment.fee,
        refunded: payment.refunded,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await PartsOrder.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

function getRequestOrigin(req) {
  return (
    process.env.CLIENT_URL ||
    req.get('origin') ||
    `${req.protocol}://${req.get('host')}`
  ).replace(/\/$/, '');
}

async function releaseOrderStock(order) {
  if (order.stockReleased) return;

  await Promise.all(
    order.items.map((item) =>
      Part.findByIdAndUpdate(item.partId, { $inc: { stock: item.quantity } })
    )
  );

  order.stockReleased = true;
}

function normalizePaymentStatus(status) {
  const normalized = String(status || '').trim().toLowerCase();
  const statuses = {
    initiated: 'Initiated',
    pending: 'Pending',
    completed: 'Completed',
    expired: 'Expired',
    'user canceled': 'User canceled',
    failed: 'Failed',
    refunded: 'Refunded',
    'partially refunded': 'Partially refunded',
  };

  return statuses[normalized] || 'Unknown';
}

exports.allOrders = async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (q) {
      const search = String(q).trim();
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');

      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { 'items.name': { $regex: search, $options: 'i' } },
        { userId: { $in: matchingUsers.map((user) => user._id) } },
      ];
    }

    const orders = await PartsOrder.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const order = await PartsOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (['confirmed', 'completed'].includes(status) && order.paymentStatus !== PAYMENT_SUCCESS_STATUS) {
      return res.status(400).json({ error: 'Order cannot be fulfilled until Khalti payment is Completed' });
    }

    order.status = status;
    if (status === 'cancelled') {
      await releaseOrderStock(order);
    }

    await order.save();
    await order.populate('userId', 'name email');

    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
