const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadToCloudinary = async (fileBuffer, folderName = 'newshub') => {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured.');
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const uploadToLocal = async (fileBuffer, originalName) => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  // ensure uploads directory exists
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // generate unique filename
  const fileExt = path.extname(originalName) || '.jpg';
  const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.promises.writeFile(filePath, fileBuffer);
  
  // return URL path that will be served statically by the Express application
  return `/uploads/${fileName}`;
};

const uploadImage = async (file) => {
  if (!file) return null;
  if (isConfigured) {
    try {
      const result = await uploadToCloudinary(file.buffer);
      return result.secure_url;
    } catch (error) {
      console.warn('Cloudinary upload failed. Falling back to local storage.', error);
      return await uploadToLocal(file.buffer, file.originalname);
    }
  } else {
    return await uploadToLocal(file.buffer, file.originalname);
  }
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured: isConfigured,
  uploadToCloudinary,
  uploadToLocal,
  uploadImage,
};
