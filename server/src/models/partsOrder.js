const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    partId: { type: mongoose.Schema.Types.ObjectId, ref: 'Part', required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, trim: true },
  },
  { _id: false }
);

const partsOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], validate: [(items) => Array.isArray(items) && items.length > 0, 'Order needs at least one item'] },
  customerName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  notes: { type: String, trim: true },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['khalti'], default: 'khalti' },
  paymentStatus: {
    type: String,
    enum: ['Initiated', 'Pending', 'Completed', 'Expired', 'User canceled', 'Failed', 'Refunded', 'Partially refunded', 'Unknown'],
    default: 'Initiated',
  },
  khaltiPidx: { type: String, trim: true, index: true },
  khaltiTransactionId: { type: String, trim: true },
  khaltiFee: { type: Number, default: 0, min: 0 },
  khaltiRefunded: { type: Boolean, default: false },
  stockReleased: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

partsOrderSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('PartsOrder', partsOrderSchema);
