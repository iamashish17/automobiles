const jwt = require('jsonwebtoken');
const { createClerkClient, verifyToken } = require('@clerk/backend');
const User = require('../models/user');

const clerkClient = process.env.CLERK_SECRET_KEY
  ? createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  : null;

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('_id role authProvider');

    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists' });
    }

    req.userId = user._id;
    req.role = user.role;
    req.authProvider = user.authProvider;
    return next();
  } catch {
    return authenticateWithClerk(req, res, next);
  }
};

async function authenticateWithClerk(req, res, next) {
  if (!process.env.CLERK_SECRET_KEY) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const payload = await verifyToken(req.headers.authorization.split(' ')[1], {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const clerkUser = await clerkClient.users.getUser(payload.sub);
    const email = clerkUser.emailAddresses.find(
      (address) => address.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: 'Clerk account requires an email address' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const displayName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ')
      || clerkUser.username
      || normalizedEmail.split('@')[0];

    let user = await User.findOne({ $or: [{ clerkId: payload.sub }, { email: normalizedEmail }] });

    if (!user) {
      user = await User.create({
        clerkId: payload.sub,
        authProvider: 'clerk',
        name: displayName,
        email: normalizedEmail,
      });
    } else {
      const nextProvider = user.authProvider === 'local' ? 'local+clerk' : user.authProvider;
      user.clerkId = user.clerkId || payload.sub;
      user.authProvider = nextProvider;
      user.name = user.name || displayName;
      await user.save();
    }

    req.userId = user._id;
    req.role = user.role;
    req.authProvider = user.authProvider;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
