const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecrettokenfornewshub123');

      // Get admin from the token
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        return res.status(401).json({ message: 'Not authorized as admin' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const protectAny = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecrettokenfornewshub123');

      // Try finding in admin first, then user
      req.admin = await Admin.findById(decoded.id).select('-password');
      if (req.admin) {
        req.user = req.admin;
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, user not found' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protectAdmin, protectAny };
