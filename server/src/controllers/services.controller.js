const Service = require('../models/service');
const defaultServices = require('../config/defaultServices');

exports.getAll = async (req, res) => {
  try {
    const { q, category, includeInactive } = req.query;
    const filter = {};

    if (includeInactive !== 'true') {
      filter.active = true;
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (q) {
      const search = String(q).trim();
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const services = await Service.find(filter).sort({ category: 1, name: 1 });
    if (services.length === 0 && includeInactive !== 'true' && !q && (!category || category === 'all')) {
      return res.json(defaultServices.map((service, index) => ({
        _id: `default-service-${index + 1}`,
        ...service,
        readonly: true,
      })));
    }

    return res.json(services);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const service = await Service.create(normalizeServicePayload(req.body));
    return res.status(201).json(service);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      normalizeServicePayload(req.body),
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json(service);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json({ message: 'Service deleted' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

function normalizeServicePayload(body) {
  const price = Number(body.price || 0);

  if (!body.name || Number.isNaN(price) || price < 0) {
    throw new Error('Service name and valid price are required');
  }

  return {
    name: String(body.name).trim(),
    category: body.category || 'Repair',
    description: body.description ? String(body.description).trim() : undefined,
    price,
    imageUrl: body.imageUrl ? String(body.imageUrl).trim() : undefined,
    active: body.active !== false,
  };
}
