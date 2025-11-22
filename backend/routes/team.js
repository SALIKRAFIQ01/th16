import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticateTeam } from '../middleware/auth.js';
import { apiLimiter, codeSubmissionLimiter } from '../middleware/rateLimiter.js';
import {
  getCurrentClue,
  submitCode,
  submitPhoto,
  getTeamProgress
} from '../controllers/teamController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `photo-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const router = express.Router();

router.use(authenticateTeam);
router.use(apiLimiter);

router.get('/clue', getCurrentClue);
router.post('/code', codeSubmissionLimiter, submitCode);
router.post('/photo', upload.single('photo'), submitPhoto);
router.get('/progress', getTeamProgress);

export default router;

