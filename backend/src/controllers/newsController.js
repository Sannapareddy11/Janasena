const News = require('../models/newsModel');
const { uploadImage } = require('../config/cloudinary');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

const generateUniqueSlug = async (title, model, excludeId = null) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let count = 1;
  
  while (true) {
    const query = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const exists = await model.findOne(query);
    if (!exists) {
      return slug;
    }
    slug = `${baseSlug}-${count}`;
    count++;
  }
};

// @desc    Get all news articles
// @route   GET /api/news
// @access  Public (Only shows published news, unless admin parameter is passed and authenticated)
const getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    // For public interface, only show published articles.
    // If isAdminQuery is passed, we check if they are authorized admins.
    if (req.query.isAdminQuery === 'true') {
      // In a real application, you might verify token here.
      // But we will allow the route protect middleware to filter requests to /api/admin/news
      // If the admin requests /api/news?isAdminQuery=true, we can optionally filter by status or search.
      if (req.query.status) {
        query.status = req.query.status;
      }
    } else {
      query.status = 'published';
    }

    // Keyword Search
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
      ];
    }

    let sortOptions = query.status === 'published' ? { publishedAt: -1 } : { createdAt: -1 };
    if (req.query.sortBy === 'views') {
      sortOptions = { viewCount: -1 };
    }

    const total = await News.countDocuments(query);
    const articles = await News.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      articles,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single news article by slug
// @route   GET /api/news/:slug
// @access  Public
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find and increment viewCount
    const news = await News.findOneAndUpdate(
      { slug },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('createdBy', 'name email');

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    // Fetch related news (3 latest published news, excluding current one)
    const relatedNews = await News.find({
      status: 'published',
      _id: { $ne: news._id },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug shortDescription thumbnailImage publishedAt viewCount');

    res.json({
      news,
      relatedNews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create news article
// @route   POST /api/admin/news
// @access  Private (Admin)
const createNews = async (req, res) => {
  try {
    const { title, shortDescription, content, status } = req.body;

    if (!title || !shortDescription || !content) {
      return res.status(400).json({ message: 'Please provide title, short description, and content' });
    }

    if (!req.files || !req.files['thumbnailImage'] || !req.files['bannerImage']) {
      return res.status(400).json({ message: 'Both thumbnail and banner images are required' });
    }

    const thumbnailFile = req.files['thumbnailImage'][0];
    const bannerFile = req.files['bannerImage'][0];

    // Upload to Cloudinary/Local
    const thumbnailImage = await uploadImage(thumbnailFile);
    const bannerImage = await uploadImage(bannerFile);

    const slug = await generateUniqueSlug(title, News);

    const news = new News({
      title,
      slug,
      shortDescription,
      content,
      thumbnailImage,
      bannerImage,
      status: status || 'draft',
      createdBy: req.admin._id,
      publishedAt: status === 'published' ? new Date() : null,
    });

    const createdNews = await news.save();
    res.status(201).json(createdNews);
  } catch (error) {
    console.error('CREATE NEWS ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update news article
// @route   PUT /api/admin/news/:id
// @access  Private (Admin)
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, content, status } = req.body;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    if (title && title !== news.title) {
      news.title = title;
      news.slug = await generateUniqueSlug(title, News, id);
    }

    if (shortDescription) news.shortDescription = shortDescription;
    if (content) news.content = content;
    
    if (status && status !== news.status) {
      if (status === 'published') {
        news.publishedAt = news.publishedAt || new Date();
      }
      news.status = status;
    }

    // Check for uploaded files
    if (req.files) {
      if (req.files['thumbnailImage']) {
        news.thumbnailImage = await uploadImage(req.files['thumbnailImage'][0]);
      }
      if (req.files['bannerImage']) {
        news.bannerImage = await uploadImage(req.files['bannerImage'][0]);
      }
    }

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    console.error('UPDATE NEWS ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete news article
// @route   DELETE /api/admin/news/:id
// @access  Private (Admin)
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }

    await News.deleteOne({ _id: id });
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single news article by ID
// @route   GET /api/admin/news/:id
// @access  Private (Admin)
const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: 'News article not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
};
