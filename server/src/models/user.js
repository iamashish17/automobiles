const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
name: { type: String, required: true, trim: true },
email: { type: String, required: true, unique: true, lowercase: true, trim: true },
passwordHash: {
  type: String,
  required() {
    return this.authProvider !== 'clerk';
  },
},
authProvider: { type: String, enum: ['local', 'clerk', 'local+clerk'], default: 'local' },
clerkId: { type: String },
role: { type: String, enum: ['user','admin'], default: 'user' },
phone: { type: String, trim: true },
createdAt: { type: Date, default: Date.now }
});

userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ clerkId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('User', userSchema);
