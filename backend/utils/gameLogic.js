import Team from '../models/Team.js';
import Clue from '../models/Clue.js';
import Submission from '../models/Submission.js';
import bcrypt from 'bcryptjs';

// Calculate time taken for a round
export const calculateRoundTime = (team, round) => {
  const roundStartTime = team.roundStartTimes.get(round);
  if (!roundStartTime) return 0;
  return Math.floor((Date.now() - roundStartTime) / 1000); // in seconds
};

// Get next clue for team
export const getNextClue = async (team) => {
  const { currentRound, currentClue } = team;
  
  // Check if there's a next clue in current round
  let nextClue = await Clue.findOne({
    round: currentRound,
    clueNumber: currentClue + 1,
    isActive: true,
    $or: [
      { assignedTeams: { $in: [team._id] } },
      { assignedTeams: { $size: 0 } },
      { isShared: true }
    ]
  });

  // If not found with team assignment, try without restriction
  if (!nextClue) {
    nextClue = await Clue.findOne({
      round: currentRound,
      clueNumber: currentClue + 1,
      isActive: true
    });
  }

  if (nextClue) {
    return nextClue;
  }

  // Check if we need to move to next round
  if (currentRound < 7) {
    let nextRoundClue = await Clue.findOne({
      round: currentRound + 1,
      clueNumber: 1,
      isActive: true,
      $or: [
        { assignedTeams: { $in: [team._id] } },
        { assignedTeams: { $size: 0 } },
        { isShared: true }
      ]
    });

    // If not found with team assignment, try without restriction
    if (!nextRoundClue) {
      nextRoundClue = await Clue.findOne({
        round: currentRound + 1,
        clueNumber: 1,
        isActive: true
      });
    }

    return nextRoundClue;
  }

  return null;
};

// Verify code submission
export const verifyCode = async (clue, submittedCode) => {
  return await bcrypt.compare(submittedCode.toLowerCase().trim(), clue.hashedAnswerCode);
};

// Handle round progression after Round 4
export const handleRound4Completion = async () => {
  const teams = await Team.find({ 
    status: 'active',
    currentRound: { $gte: 4 }
  }).sort({ totalTime: 1 });

  // Mark top 5 as advancing, bottom 5 as eliminated
  teams.forEach((team, index) => {
    if (index < 5) {
      team.status = 'active';
      team.rank = index + 1;
    } else {
      team.status = 'eliminated';
      team.eliminatedAt = 4;
      team.rank = index + 1;
    }
    team.save();
  });

  return teams;
};

// Handle Round 5 pairing logic
export const setupRound5Pairings = async () => {
  const activeTeams = await Team.find({ 
    status: 'active',
    currentRound: 5
  }).sort({ totalTime: 1 }).limit(5);

  // Team 1 vs Team 2, Team 3 vs Team 4, Team 5 unique
  const pairings = [
    { teams: [activeTeams[0], activeTeams[1]], clueType: 'pair1' },
    { teams: [activeTeams[2], activeTeams[3]], clueType: 'pair2' },
    { teams: [activeTeams[4]], clueType: 'unique' }
  ];

  return pairings;
};

// Handle Round 6 - first 2 to solve advance
export const checkRound6Advancement = async () => {
  const round6Teams = await Team.find({
    status: 'active',
    currentRound: 6
  });

  // Get teams that completed round 6
  const completedTeams = round6Teams.filter(team => {
    const roundTime = team.roundTimes.get(6);
    return roundTime !== undefined;
  }).sort((a, b) => {
    const timeA = a.roundTimes.get(6) || Infinity;
    const timeB = b.roundTimes.get(6) || Infinity;
    return timeA - timeB;
  });

  // First 2 advance, rest eliminated
  completedTeams.forEach((team, index) => {
    if (index < 2) {
      team.status = 'finalist';
    } else {
      team.status = 'eliminated';
      team.eliminatedAt = 6;
    }
    team.save();
  });

  return completedTeams;
};

// Handle Round 7 - winner determination
export const checkRound7Winner = async () => {
  const finalists = await Team.find({
    status: 'finalist',
    currentRound: 7
  });

  const completedTeams = finalists.filter(team => {
    const roundTime = team.roundTimes.get(7);
    return roundTime !== undefined;
  }).sort((a, b) => {
    const timeA = a.roundTimes.get(7) || Infinity;
    const timeB = b.roundTimes.get(7) || Infinity;
    return timeA - timeB;
  });

  if (completedTeams.length > 0) {
    completedTeams[0].status = 'winner';
    completedTeams[0].save();
    
    if (completedTeams.length > 1) {
      completedTeams[1].status = 'eliminated';
      completedTeams[1].eliminatedAt = 7;
      completedTeams[1].save();
    }
  }

  return completedTeams;
};

// Get team progress summary
export const getTeamProgress = async (teamId) => {
  const team = await Team.findById(teamId);
  if (!team) return null;

  const elapsedTime = Math.floor((Date.now() - team.startTime) / 1000);
  
  return {
    teamName: team.teamName,
    currentRound: team.currentRound,
    currentClue: team.currentClue,
    status: team.status,
    totalTime: team.totalTime,
    elapsedTime,
    rank: team.rank,
    completedClues: team.completedClues.length
  };
};

