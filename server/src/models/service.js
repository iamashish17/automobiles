const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  category: {
    type: String,
    enum: ['Repair', 'Maintenance', 'Additional'],
    default: 'Repair',
  },
  description: { type: String, trim: true },
  price: { type: Number, min: 0, default: 0 },
  imageUrl: { type: String, trim: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

serviceSchema.index({ name: 'text', category: 1 });
serviceSchema.index({ active: 1, category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
