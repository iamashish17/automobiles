const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
category: { type: String, required: true, trim: true },
vehicleModel: { type: String, trim: true },
brand: { type: String, trim: true },
price: { type: Number, required: true, min: 0 },
stock: { type: Number, default: 0, min: 0 },
description: { type: String, trim: true },
imageUrl: { type: String, trim: true },
featured: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now }
});

partSchema.index({ name: 'text', vehicleModel: 'text', brand: 'text' });
partSchema.index({ category: 1, createdAt: -1 });

module.exports = mongoose.model('Part', partSchema);
