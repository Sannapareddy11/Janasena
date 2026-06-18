const express = require('express');
const router = express.Router();
const { loginAdmin, getDashboardAnalytics } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  getAllContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');
const {
  getAllDeletionRequests,
  updateDeletionRequest,
  deleteDeletionRequest,
} = require('../controllers/deletionRequestController');

router.post('/login', loginAdmin);
router.get('/dashboard', protectAdmin, getDashboardAnalytics);

// Contact management routes (Admin only)
router.get('/contacts', protectAdmin, getAllContactMessages);
router.put('/contacts/:id', protectAdmin, updateContactMessage);
router.delete('/contacts/:id', protectAdmin, deleteContactMessage);

// Deletion request management routes (Admin only)
router.get('/deletion-requests', protectAdmin, getAllDeletionRequests);
router.put('/deletion-requests/:id', protectAdmin, updateDeletionRequest);
router.delete('/deletion-requests/:id', protectAdmin, deleteDeletionRequest);

module.exports = router;
