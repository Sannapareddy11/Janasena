const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const News = require('../models/newsModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecrettokenfornewshub123', {
    expiresIn: '30d',
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const publishedNews = await News.countDocuments({ status: 'published' });
    const draftNews = await News.countDocuments({ status: 'draft' });

    // Aggregate total views
    const viewStats = await News.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$viewCount' },
        },
      },
    ]);

    const totalViews = viewStats.length > 0 ? viewStats[0].totalViews : 0;

    // Get top 5 most viewed news articles
    const popularNews = await News.find()
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title viewCount status publishedAt slug');

    // Get 5 recent articles
    const recentNews = await News.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title viewCount status createdAt slug');

    res.json({
      totalNews,
      publishedNews,
      draftNews,
      totalViews,
      popularNews,
      recentNews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginAdmin,
  getDashboardAnalytics,
};
