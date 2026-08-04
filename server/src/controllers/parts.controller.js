const Part = require('../models/part');

// GET /api/parts - get all parts, with optional search
exports.getAll = async (req, res) => {
  try {
    const { q, category, featured } = req.query;
    const filter = {};

    if (q) {
      const search = String(q).trim();
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { vehicleModel: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;

    const parts = await Part.find(filter).sort({ createdAt: -1 });
    return res.json(parts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/parts/:id - get one part
exports.getOne = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) return res.status(404).json({ error: 'Part not found' });
    return res.json(part);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/parts - create a part (admin only)
exports.create = async (req, res) => {
  try {
    const payload = normalizePartPayload(req.body);
    const part = await Part.create(payload);
    return res.status(201).json(part);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// PUT /api/parts/:id - update a part (admin only)
exports.update = async (req, res) => {
  try {
    const part = await Part.findByIdAndUpdate(
      req.params.id,
      normalizePartPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!part) return res.status(404).json({ error: 'Part not found' });
    return res.json(part);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE /api/parts/:id - delete a part (admin only)
exports.remove = async (req, res) => {
  try {
    const part = await Part.findByIdAndDelete(req.params.id);
    if (!part) return res.status(404).json({ error: 'Part not found' });
    return res.json({ message: 'Part deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

function normalizePartPayload(body) {
  const price = Number(body.price);
  const stock = Number(body.stock || 0);

  if (!body.name || !body.category || Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
    throw new Error('Name, category, valid price and valid stock are required');
  }

  return {
    name: String(body.name).trim(),
    category: String(body.category).trim(),
    vehicleModel: body.vehicleModel ? String(body.vehicleModel).trim() : undefined,
    brand: body.brand ? String(body.brand).trim() : undefined,
    price,
    stock,
    description: body.description ? String(body.description).trim() : undefined,
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : undefined,
    featured: Boolean(body.featured),
  };
}
