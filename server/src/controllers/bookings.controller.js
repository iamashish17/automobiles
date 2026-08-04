const Booking = require('../models/booking');
const mongoose = require('mongoose');
const User = require('../models/user');

function parseBookingDateTime(dateString, timeString) {
  const timeMatch = String(timeString).trim().match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!timeMatch) return null;

  let hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const period = timeMatch[3].toUpperCase();

  if (period === 'AM') {
    hours = hours === 12 ? 0 : hours;
  } else {
    hours = hours === 12 ? 12 : hours + 12;
  }

  const bookingDateTime = new Date(`${dateString}T00:00:00`);
  bookingDateTime.setHours(hours, minutes, 0, 0);
  return bookingDateTime;
}

exports.create = async (req, res) => {
  try {
    const { serviceName, vehicleModel, date, time, notes } = req.body;
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bookingDateTime = parseBookingDateTime(date, time);

    if (!serviceName || !vehicleModel || !date || !time) {
      return res.status(400).json({
        error: 'Service, vehicle model, date and time are required',
      });
    }

    if (!bookingDateTime || Number.isNaN(bookingDateTime.getTime())) {
      return res.status(400).json({ error: 'Invalid booking date or time' });
    }

    if (bookingDateTime < todayDate) {
      return res.status(400).json({ error: 'You cannot book a service in the past' });
    }

    if (bookingDateTime < now) {
      return res.status(400).json({ error: 'Selected time has already passed' });
    }

    const booking = await Booking.create({
      userId: req.userId,
      serviceName: String(serviceName).trim(),
      vehicleModel: String(vehicleModel).trim(),
      date: String(date).trim(),
      time: String(time).trim(),
      notes: notes ? String(notes).trim() : undefined,
    });

    return res.status(201).json({
      message: 'Service booked successfully',
      booking,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.allBookings = async (req, res) => {
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
        { serviceName: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } },
        { notes: { $regex: search, $options: 'i' } },
        { userId: { $in: matchingUsers.map((user) => user._id) } },
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid booking id' });
    }

    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json({ message: 'Booking deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
