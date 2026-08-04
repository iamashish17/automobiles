const User = require('../models/user');
const mongoose = require('mongoose');

exports.getAll = async (req, res) => {
  try {
    const { q, role } = req.query;
    const filter = {};

    if (role && role !== 'all') {
      filter.role = role;
    }

    if (q) {
      const search = String(q).trim();
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid user role' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    const target = await User.findById(req.params.id).select('_id role');
    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (String(target._id) === String(req.userId) && target.role === 'admin' && role === 'user' && adminCount <= 1) {
      return res.status(400).json({ error: 'At least one admin account is required' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
      .select('-passwordHash');

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    if (String(req.params.id) === String(req.userId)) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
