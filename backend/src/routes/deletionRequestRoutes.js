const express = require('express');
const router = express.Router();
const {
  createDeletionRequest,
  getAllDeletionRequests,
  updateDeletionRequest,
  deleteDeletionRequest,
} = require('../controllers/deletionRequestController');

// Public route for creating deletion request
router.post('/', createDeletionRequest);

module.exports = router;
