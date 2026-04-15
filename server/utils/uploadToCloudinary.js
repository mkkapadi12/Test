const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (buffer, folder = 'test/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });
};

module.exports = uploadToCloudinary;
