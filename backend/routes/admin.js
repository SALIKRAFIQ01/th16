import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import {
  getAllTeams,
  getTeamDetails,
  updateTeamStatus,
  overrideElimination,
  triggerRound4Completion,
  triggerRound6Advancement,
  triggerRound7Winner,
  getGameStats
} from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateAdmin);
router.use(apiLimiter);

router.get('/teams', getAllTeams);
router.get('/teams/:teamId', getTeamDetails);
router.patch('/teams/:teamId/status', updateTeamStatus);
router.post('/teams/:teamId/override-elimination', overrideElimination);
router.post('/rounds/4/complete', triggerRound4Completion);
router.post('/rounds/6/advance', triggerRound6Advancement);
router.post('/rounds/7/winner', triggerRound7Winner);
router.get('/stats', getGameStats);

export default router;

