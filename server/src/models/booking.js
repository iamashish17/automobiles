const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceName: { type: String, required: true, trim: true },
  vehicleModel: { type: String, required: true, trim: true },
  date: { type: String, required: true }, 
  time: { type: String, required: true }, 
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
