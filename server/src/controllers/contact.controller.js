const Contact = require('../models/contact');

exports.submit = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return res.status(201).json({ message: 'Message received. We will get back to you soon!', contact });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json(contacts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact message not found' });
    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.markUnread = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: 'unread' }, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact message not found' });
    return res.json(contact);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact message not found' });
    return res.json({ message: 'Contact message deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
