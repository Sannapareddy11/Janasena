const multer = require('multer');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for files
    fieldSize: 10 * 1024 * 1024, // 10MB limit for text fields (like article content)
  },
});

module.exports = upload;
