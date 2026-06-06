const cloudinary = require('cloudinary').v2;
const { S3Client } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cloudinary Config
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// S3 Config
const isS3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_REGION &&
  process.env.AWS_S3_BUCKET_NAME
);

let s3Client;
if (isS3Configured) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

const uploadToS3 = async (fileBuffer, originalName, folderName = 'newshub') => {
  if (!isS3Configured) {
    throw new Error('S3 is not configured.');
  }

  const fileExt = path.extname(originalName) || '.jpg';
  const fileName = `${folderName}/${crypto.randomBytes(16).toString('hex')}${fileExt}`;

  let contentType = 'image/jpeg';
  if (fileExt.toLowerCase() === '.png') contentType = 'image/png';
  else if (fileExt.toLowerCase() === '.webp') contentType = 'image/webp';
  else if (fileExt.toLowerCase() === '.gif') contentType = 'image/gif';

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  await upload.done();
  
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

const uploadToCloudinary = async (fileBuffer, folderName = 'newshub') => {
  if (!isCloudinaryConfigured) {
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
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = path.extname(originalName) || '.jpg';
  const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.promises.writeFile(filePath, fileBuffer);
  
  return `/uploads/${fileName}`;
};

const uploadImage = async (file) => {
  if (!file) return null;
  
  // Prioritize S3, then Cloudinary, then local
  if (isS3Configured) {
    try {
      const url = await uploadToS3(file.buffer, file.originalname);
      return url;
    } catch (error) {
      console.warn('S3 upload failed. Falling back to local storage.', error);
      return await uploadToLocal(file.buffer, file.originalname);
    }
  } else if (isCloudinaryConfigured) {
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
  s3Client,
  isCloudinaryConfigured,
  isS3Configured,
  uploadToCloudinary,
  uploadToS3,
  uploadToLocal,
  uploadImage,
};
