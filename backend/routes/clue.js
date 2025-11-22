import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  getAllClues,
  getClueById,
  createClue,
  updateClue,
  deleteClue,
  assignClueToTeam
} from '../controllers/clueController.js';

const router = express.Router();

router.use(authenticateAdmin);
router.use(apiLimiter);

router.get('/', getAllClues);
router.get('/:clueId', getClueById);
router.post('/', createClue);
router.patch('/:clueId', updateClue);
router.delete('/:clueId', deleteClue);
router.post('/:clueId/assign', assignClueToTeam);

export default router;

