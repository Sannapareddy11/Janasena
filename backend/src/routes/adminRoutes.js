const express = require('express');
const router = express.Router();
const { loginAdmin, getDashboardAnalytics } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.get('/dashboard', protectAdmin, getDashboardAnalytics);

module.exports = router;
