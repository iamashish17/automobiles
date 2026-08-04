const Review = require('../models/review');

const FALLBACK_REVIEWS = [
  {
    _id: 'fallback-1',
    name: 'Hari Thapa',
    rating: 5,
    message: 'I have been a customer of New Purnagiri Automobiles for years. They always provide excellent service.',
    createdAt: new Date('2025-06-15T00:00:00.000Z'),
    approved: true,
    moderationStatus: 'approved',
  },
  {
    _id: 'fallback-2',
    name: 'Nirmal Dahal',
    rating: 4,
    message: 'Very professional service. My car runs like new!',
    createdAt: new Date('2025-06-12T00:00:00.000Z'),
    approved: true,
    moderationStatus: 'approved',
  },
  {
    _id: 'fallback-3',
    name: 'Sanjay Lama',
    rating: 3,
    message: 'Friendly staff and helpful maintenance advice.',
    createdAt: new Date('2025-06-10T00:00:00.000Z'),
    approved: true,
    moderationStatus: 'approved',
  },
];

exports.getApproved = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 3, 1);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({
        $or: [{ approved: true }, { moderationStatus: 'approved' }],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments({
        $or: [{ approved: true }, { moderationStatus: 'approved' }],
      }),
    ]);

    const source = total === 0 ? FALLBACK_REVIEWS : reviews;
    const totalCount = total === 0 ? FALLBACK_REVIEWS.length : total;

    return res.json({
      reviews: source,
      page,
      limit,
      total: totalCount,
      hasMore: skip + source.length < totalCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.submit = async (req, res) => {
  try {
    const { name, rating, message } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ error: 'Name, rating and message are required' });
    }

    const review = await Review.create({
      name: String(name).trim(),
      rating: Number(rating),
      message: String(message).trim(),
      userId: req.userId || undefined,
    });

    return res.status(201).json({
      message: 'Review submitted! Pending approval.',
      review,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json(reviews);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'approved', approved: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json(review);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { moderationStatus: 'rejected', approved: false },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    return res.json(review);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
