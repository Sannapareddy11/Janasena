const DeletionRequest = require('../models/deletionRequestModel');
const User = require('../models/userModel');

// @desc    Create a new deletion request
// @route   POST /api/deletion-request
// @access  Public
const createDeletionRequest = async (req, res) => {
  try {
    const { name, email, reason } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if there's already a pending or processing request for this email
    const existingRequest = await DeletionRequest.findOne({
      email: email.toLowerCase(),
      status: { $in: ['pending', 'processing'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: 'A deletion request is already being processed for this email. Please wait for completion or contact support.',
      });
    }

    // Create new deletion request
    const deletionRequest = new DeletionRequest({
      name,
      email: email.toLowerCase(),
      reason: reason || '',
    });

    await deletionRequest.save();

    res.status(201).json({
      message: 'Deletion request submitted successfully. Your account and data will be deleted within 30 days.',
      requestId: deletionRequest._id,
    });
  } catch (error) {
    console.error('CREATE DELETION REQUEST ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all deletion requests (Admin only)
// @route   GET /api/admin/deletion-requests
// @access  Private (Admin)
const getAllDeletionRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await DeletionRequest.countDocuments(query);
    const requests = await DeletionRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      requests,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update deletion request status (Admin only)
// @route   PUT /api/admin/deletion-requests/:id
// @access  Private (Admin)
const updateDeletionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const deletionRequest = await DeletionRequest.findById(id);

    if (!deletionRequest) {
      return res.status(404).json({ message: 'Deletion request not found' });
    }

    if (status) {
      deletionRequest.status = status;
      
      if (status === 'completed') {
        deletionRequest.processedAt = new Date();
        
        // Delete the user account if it exists
        const user = await User.findOne({ email: deletionRequest.email });
        if (user) {
          await User.deleteOne({ _id: user._id });
        }
      }
    }

    if (notes !== undefined) {
      deletionRequest.notes = notes;
    }

    const updatedRequest = await deletionRequest.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error('UPDATE DELETION REQUEST ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete deletion request (Admin only)
// @route   DELETE /api/admin/deletion-requests/:id
// @access  Private (Admin)
const deleteDeletionRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletionRequest = await DeletionRequest.findById(id);

    if (!deletionRequest) {
      return res.status(404).json({ message: 'Deletion request not found' });
    }

    await DeletionRequest.deleteOne({ _id: id });
    res.json({ message: 'Deletion request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDeletionRequest,
  getAllDeletionRequests,
  updateDeletionRequest,
  deleteDeletionRequest,
};
