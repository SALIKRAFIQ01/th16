import express from 'express';
import { teamLogin, adminLogin } from '../controllers/authController.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/team/login', authLimiter, teamLogin);
router.post('/admin/login', authLimiter, adminLogin);

export default router;

