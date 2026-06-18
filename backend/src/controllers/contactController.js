const Contact = require('../models/contactModel');

// @desc    Create a new contact message
// @route   POST /api/contact
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email: email.toLowerCase(),
      subject,
      message,
    });

    await contact.save();

    res.status(201).json({
      message: 'Your message has been sent successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('CREATE CONTACT MESSAGE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages (Admin only)
// @route   GET /api/admin/contacts
// @access  Private (Admin)
const getAllContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Contact.countDocuments(query);
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      messages,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact message status (Admin only)
// @route   PUT /api/admin/contacts/:id
// @access  Private (Admin)
const updateContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    if (status) {
      contact.status = status;
    }

    if (notes !== undefined) {
      contact.notes = notes;
    }

    const updatedContact = await contact.save();
    res.json(updatedContact);
  } catch (error) {
    console.error('UPDATE CONTACT MESSAGE ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact message (Admin only)
// @route   DELETE /api/admin/contacts/:id
// @access  Private (Admin)
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    await Contact.deleteOne({ _id: id });
    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
  updateContactMessage,
  deleteContactMessage,
};
