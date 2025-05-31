import express from 'express';
import multer from 'multer';
import { uploadImage, getImage } from '../controllers/image_controller.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.post('/upload', upload.single('image'), uploadImage);
router.get('/:fileId', getImage);

// Test route
router.get('/test/upload', (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Test Image Upload</h2>
        <form action="/api/images/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="image" accept="image/*">
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
  `);
});

export default router;