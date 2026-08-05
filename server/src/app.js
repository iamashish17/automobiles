const express = require('express');
const cors = require('cors');
require('dotenv').config();
const securityHeaders = require('./middleware/security.middleware');

const app = express();

app.disable('x-powered-by');
app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(securityHeaders);
app.use('/api/parts', require('./routes/parts.routes'));
app.use('/api/contact', require('./routes/contact.routes'));
app.use('/api/reviews', require('./routes/reviews.routes'));
app.use('/api/bookings', require('./routes/bookings.routes'));
app.use('/api/services', require('./routes/services.routes'));
app.use('/api/users', require('./routes/users.routes'));


const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
