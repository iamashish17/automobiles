const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  message: { type: String, required: true, trim: true },
  moderationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
reviewSchema.index({ moderationStatus: 1, approved: 1, createdAt: -1 });
module.exports = mongoose.model('Review', reviewSchema);
