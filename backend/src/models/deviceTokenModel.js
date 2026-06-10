const mongoose = require('mongoose');

const deviceTokenSchema = new mongoose.Schema(
  {
    fcmToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ['web', 'android', 'ios', 'unknown'],
      default: 'unknown',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const DeviceToken = mongoose.model('DeviceToken', deviceTokenSchema);
module.exports = DeviceToken;
