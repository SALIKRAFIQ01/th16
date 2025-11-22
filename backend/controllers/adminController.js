import Team from '../models/Team.js';
import Clue from '../models/Clue.js';
import Submission from '../models/Submission.js';
import { handleRound4Completion, checkRound6Advancement, checkRound7Winner } from '../utils/gameLogic.js';
import { getIO } from '../services/socketService.js';

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().sort({ totalTime: 1, createdAt: 1 });
    
    const teamsData = teams.map(team => {
      const elapsedTime = Math.floor((Date.now() - team.startTime) / 1000);
      return {
        id: team._id,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentClue: team.currentClue,
        status: team.status,
        startTime: team.startTime,
        elapsedTime,
        totalTime: team.totalTime,
        rank: team.rank,
        eliminatedAt: team.eliminatedAt,
        completedClues: team.completedClues.length,
        submittedPhotos: team.submittedPhotos
      };
    });

    res.json({ teams: teamsData });
  } catch (error) {
    console.error('Get all teams error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeamDetails = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const elapsedTime = Math.floor((Date.now() - team.startTime) / 1000);
    
    res.json({
      id: team._id,
      teamName: team.teamName,
      teamCode: team.teamCode,
      currentRound: team.currentRound,
      currentClue: team.currentClue,
      status: team.status,
      startTime: team.startTime,
      elapsedTime,
      totalTime: team.totalTime,
      rank: team.rank,
      eliminatedAt: team.eliminatedAt,
      completedClues: team.completedClues,
      submittedPhotos: team.submittedPhotos,
      roundTimes: Object.fromEntries(team.roundTimes),
      roundStartTimes: Object.fromEntries(team.roundStartTimes)
    });
  } catch (error) {
    console.error('Get team details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTeamStatus = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { status, currentRound, currentClue } = req.body;
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (status) team.status = status;
    if (currentRound) team.currentRound = currentRound;
    if (currentClue) team.currentClue = currentClue;

    await team.save();

    // Emit update
    const io = getIO();
    if (io) io.to('admin').emit('teamUpdate', {
      teamId: team._id,
      teamName: team.teamName,
      currentRound: team.currentRound,
      currentClue: team.currentClue,
      status: team.status
    });

    res.json({ message: 'Team updated successfully', team });
  } catch (error) {
    console.error('Update team status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const overrideElimination = async (req, res) => {
  try {
    const { teamId } = req.params;
    
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    team.status = 'active';
    team.eliminatedAt = null;
    await team.save();

    const io = getIO();
    if (io) io.to('admin').emit('teamUpdate', {
      teamId: team._id,
      teamName: team.teamName,
      status: team.status
    });

    res.json({ message: 'Elimination overridden', team });
  } catch (error) {
    console.error('Override elimination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const triggerRound4Completion = async (req, res) => {
  try {
    const teams = await handleRound4Completion();
    
    const io = getIO();
    if (io) io.to('admin').emit('roundCompletion', {
      round: 4,
      teams: teams.map(t => ({
        id: t._id,
        teamName: t.teamName,
        status: t.status,
        rank: t.rank
      }))
    });

    res.json({ message: 'Round 4 completion processed', teams });
  } catch (error) {
    console.error('Trigger round 4 completion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const triggerRound6Advancement = async (req, res) => {
  try {
    const teams = await checkRound6Advancement();
    
    const io = getIO();
    if (io) io.to('admin').emit('roundCompletion', {
      round: 6,
      teams: teams.map(t => ({
        id: t._id,
        teamName: t.teamName,
        status: t.status
      }))
    });

    res.json({ message: 'Round 6 advancement processed', teams });
  } catch (error) {
    console.error('Trigger round 6 advancement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const triggerRound7Winner = async (req, res) => {
  try {
    const teams = await checkRound7Winner();
    
    const io = getIO();
    if (io) io.to('admin').emit('gameComplete', {
      winner: teams.find(t => t.status === 'winner'),
      teams: teams.map(t => ({
        id: t._id,
        teamName: t.teamName,
        status: t.status
      }))
    });

    res.json({ message: 'Round 7 winner determined', teams });
  } catch (error) {
    console.error('Trigger round 7 winner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGameStats = async (req, res) => {
  try {
    const totalTeams = await Team.countDocuments();
    const activeTeams = await Team.countDocuments({ status: 'active' });
    const eliminatedTeams = await Team.countDocuments({ status: 'eliminated' });
    const finalists = await Team.countDocuments({ status: 'finalist' });
    const winner = await Team.findOne({ status: 'winner' });

    const teamsByRound = {};
    for (let i = 1; i <= 7; i++) {
      teamsByRound[i] = await Team.countDocuments({ currentRound: i });
    }

    res.json({
      totalTeams,
      activeTeams,
      eliminatedTeams,
      finalists,
      winner: winner ? {
        id: winner._id,
        teamName: winner.teamName,
        totalTime: winner.totalTime
      } : null,
      teamsByRound
    });
  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

