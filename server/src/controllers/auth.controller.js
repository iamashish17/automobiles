const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

function buildAuthPayload(user, message) {
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    ...(message ? { message } : {}),
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
    },
  };
}
 
// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing?.passwordHash) return res.status(400).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = existing || new User({ email: normalizedEmail });
    user.name = String(name).trim();
    user.passwordHash = passwordHash;
    user.phone = phone ? String(phone).trim() : user.phone;
    user.authProvider = user.clerkId ? 'local+clerk' : 'local';
    await user.save();

    return res.status(201).json(buildAuthPayload(user, 'Account created successfully'));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 
// Login an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.passwordHash) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    return res.json(buildAuthPayload(user));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
 
// Get current logged-in user
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.clerkSession = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(buildAuthPayload(user));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
