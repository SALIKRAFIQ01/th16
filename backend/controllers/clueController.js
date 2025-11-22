import Clue from '../models/Clue.js';
import Team from '../models/Team.js';
import bcrypt from 'bcryptjs';

export const getAllClues = async (req, res) => {
  try {
    const clues = await Clue.find().sort({ round: 1, clueNumber: 1 });
    res.json({ clues });
  } catch (error) {
    console.error('Get all clues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClueById = async (req, res) => {
  try {
    const { clueId } = req.params;
    const clue = await Clue.findById(clueId);
    
    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    res.json({ clue });
  } catch (error) {
    console.error('Get clue by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createClue = async (req, res) => {
  try {
    const { round, clueNumber, difficulty, clueText, answerCode, location, hints, assignedTeams } = req.body;

    if (!round || !clueNumber || !difficulty || !clueText || !answerCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedAnswerCode = await bcrypt.hash(answerCode.toLowerCase().trim(), 10);

    const clue = new Clue({
      round,
      clueNumber,
      difficulty,
      clueText,
      answerCode,
      hashedAnswerCode,
      location: location || '',
      hints: hints || [],
      assignedTeams: assignedTeams || []
    });

    await clue.save();
    res.status(201).json({ message: 'Clue created successfully', clue });
  } catch (error) {
    console.error('Create clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClue = async (req, res) => {
  try {
    const { clueId } = req.params;
    const updates = req.body;

    if (updates.answerCode) {
      updates.hashedAnswerCode = await bcrypt.hash(updates.answerCode.toLowerCase().trim(), 10);
    }

    const clue = await Clue.findByIdAndUpdate(clueId, updates, { new: true, runValidators: true });
    
    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    res.json({ message: 'Clue updated successfully', clue });
  } catch (error) {
    console.error('Update clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteClue = async (req, res) => {
  try {
    const { clueId } = req.params;
    const clue = await Clue.findByIdAndDelete(clueId);
    
    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    res.json({ message: 'Clue deleted successfully' });
  } catch (error) {
    console.error('Delete clue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignClueToTeam = async (req, res) => {
  try {
    const { clueId } = req.params;
    const { teamIds } = req.body;

    const clue = await Clue.findById(clueId);
    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    clue.assignedTeams = teamIds;
    await clue.save();

    res.json({ message: 'Clue assigned to teams', clue });
  } catch (error) {
    console.error('Assign clue to team error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

