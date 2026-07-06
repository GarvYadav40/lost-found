import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import { syncAndRequireAuth } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, and WebP images are allowed'));
    }
  },
});

// POST /api/upload
router.post('/', syncAndRequireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  // Stream upload to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'lost_and_found_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ error: 'Cloudinary upload failed' });
      }

      return res.status(200).json({
        imageUrl: result.secure_url,
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

export default router;
