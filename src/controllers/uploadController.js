// src/controllers/uploadController.js
const cloudinary = require('../config/cloudinary');
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No file uploaded', 400);
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'cosmetics-products',
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    return successResponse(res, {
      url: result.secure_url,
      cloudinaryId: result.public_id,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return errorResponse(res, 'No files uploaded', 400);
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cosmetics-products',
            transformation: [
              { width: 1000, height: 1000, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              cloudinaryId: result.public_id,
              width: result.width,
              height: result.height
            });
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const images = await Promise.all(uploadPromises);
    return successResponse(res, images);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { cloudinaryId } = req.params;

    await cloudinary.uploader.destroy(cloudinaryId);
    return successResponse(res, { message: 'Image deleted successfully' });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};