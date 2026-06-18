const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllContactMessages,
  updateContactMessage,
  deleteContactMessage,
} = require('../controllers/contactController');

// Public route for creating contact message
router.post('/', createContactMessage);

module.exports = router;
