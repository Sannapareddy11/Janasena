const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getNewsById,
} = require('../controllers/newsController');
const { protectAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/news', getAllNews);
router.get('/news/:slug', getNewsBySlug);

// Admin routes (prefixed with /admin in app.js mounting if needed, or structured here)
router.get('/admin/news/:id', protectAdmin, getNewsById);

router.post(
  '/admin/news',
  protectAdmin,
  upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  createNews
);

router.put(
  '/admin/news/:id',
  protectAdmin,
  upload.fields([
    { name: 'thumbnailImage', maxCount: 1 },
    { name: 'bannerImage', maxCount: 1 },
  ]),
  updateNews
);

router.delete('/admin/news/:id', protectAdmin, deleteNews);

module.exports = router;
