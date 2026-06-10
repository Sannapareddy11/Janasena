const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const DeviceToken = require('../models/deviceTokenModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecrettokenfornewshub123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all details' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register or update FCM device token for push notifications
// @route   POST /api/users/fcm-token
// @access  Public
const registerFcmToken = async (req, res) => {
  try {
    const { fcmToken, platform } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'fcmToken is required' });
    }

    const allowedPlatforms = ['web', 'android', 'ios', 'unknown'];
    const normalizedPlatform = allowedPlatforms.includes(platform) ? platform : 'unknown';

    let userId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(
          authHeader.split(' ')[1],
          process.env.JWT_SECRET || 'supersecrettokenfornewshub123'
        );
        const user = await User.findById(decoded.id).select('_id');
        if (user) {
          userId = user._id;
        }
      } catch (err) {
        // Token optional; continue as anonymous subscriber
      }
    }

    const device = await DeviceToken.findOneAndUpdate(
      { fcmToken },
      {
        fcmToken,
        platform: normalizedPlatform,
        user: userId,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: 'FCM token registered successfully',
      deviceTokenId: device._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister FCM device token (e.g. on logout or permission revoke)
// @route   DELETE /api/users/fcm-token
// @access  Public
const unregisterFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: 'fcmToken is required' });
    }

    await DeviceToken.findOneAndUpdate({ fcmToken }, { isActive: false });

    res.json({ message: 'FCM token unregistered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  registerFcmToken,
  unregisterFcmToken,
};
