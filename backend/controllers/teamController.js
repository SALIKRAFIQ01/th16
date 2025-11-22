import Team from '../models/Team.js';
import Clue from '../models/Clue.js';
import Submission from '../models/Submission.js';
import { verifyCode, getNextClue, calculateRoundTime } from '../utils/gameLogic.js';
import { getIO } from '../services/socketService.js';

export const getCurrentClue = async (req, res) => {
  try {
    const team = req.team;
    
    console.log(`Fetching clue for team: ${team.teamName}, Round: ${team.currentRound}, Clue: ${team.currentClue}`);
    
    // First, try to find clue assigned to this team
    let clue = await Clue.findOne({
      round: team.currentRound,
      clueNumber: team.currentClue,
      isActive: true,
      $or: [
        { assignedTeams: { $in: [team._id] } },
        { assignedTeams: { $size: 0 } },
        { isShared: true }
      ]
    });

    // If not found with team assignment, try without team restriction (for shared clues)
    if (!clue) {
      clue = await Clue.findOne({
        round: team.currentRound,
        clueNumber: team.currentClue,
        isActive: true
      });
    }

    if (!clue) {
      console.error(`Clue not found: Round ${team.currentRound}, Clue ${team.currentClue}`);
      return res.status(404).json({ 
        message: `Clue not found for Round ${team.currentRound}, Clue ${team.currentClue}` 
      });
    }

    // Check if team has access to this clue (only if clue has assigned teams)
    if (clue.assignedTeams && clue.assignedTeams.length > 0) {
      const hasAccess = clue.assignedTeams.some(
        assignedId => assignedId.toString() === team._id.toString()
      );
      
      if (!hasAccess && !clue.isShared) {
        console.error(`Access denied: Team ${team.teamName} cannot access clue ${clue._id}`);
        return res.status(403).json({ message: 'Access denied to this clue' });
      }
    }

    res.json({
      clue: {
        id: clue._id,
        round: clue.round,
        clueNumber: clue.clueNumber,
        clueText: clue.clueText,
        location: clue.location,
        difficulty: clue.difficulty
      },
      progress: {
        currentRound: team.currentRound,
        currentClue: team.currentClue,
        status: team.status
      }
    });
  } catch (error) {
    console.error('Get current clue error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitCode = async (req, res) => {
  try {
    const team = req.team;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    if (team.status === 'eliminated') {
      return res.status(403).json({ message: 'Team has been eliminated' });
    }

    console.log(`Team ${team.teamName} submitting code for Round ${team.currentRound}, Clue ${team.currentClue}`);

    // Find clue assigned to this team or shared
    let clue = await Clue.findOne({
      round: team.currentRound,
      clueNumber: team.currentClue,
      isActive: true,
      $or: [
        { assignedTeams: { $in: [team._id] } },
        { assignedTeams: { $size: 0 } },
        { isShared: true }
      ]
    });

    if (!clue) {
      clue = await Clue.findOne({
        round: team.currentRound,
        clueNumber: team.currentClue,
        isActive: true
      });
    }

    if (!clue) {
      return res.status(404).json({ message: 'Clue not found' });
    }

    // Access check
    if (clue.assignedTeams?.length > 0) {
      const hasAccess = clue.assignedTeams.some(
        id => id.toString() === team._id.toString()
      );
      if (!hasAccess && !clue.isShared) {
        return res.status(403).json({ message: 'Access denied to this clue' });
      }
    }

    // Create submission record
    const submission = new Submission({
      teamId: team._id,
      clueId: clue._id,
      round: team.currentRound,
      submissionType: 'code',
      submittedCode: code,
      submittedAt: new Date()
    });

    // Verify
    const isCorrect = await verifyCode(clue, code);
    submission.isCorrect = isCorrect;

    if (!isCorrect) {
      await submission.save();
      return res.status(400).json({ message: 'Incorrect code. Please try again.' });
    }

    console.log(`Code correct → Updating team progress...`);

    // Fix: Ensure Map key is a STRING
    const roundKey = String(team.currentRound);

    const roundStartTime =
      team.roundStartTimes.get(roundKey) || team.startTime;

    const timeTaken = Math.floor((Date.now() - roundStartTime) / 1000);

    team.completedClues.push({
      clueId: clue._id,
      round: team.currentRound,
      clueNumber: team.currentClue,
      completedAt: new Date()
    });

    // Round 4 last clue → require photo
    const isRound4LastClue =
      team.currentRound === 4 && team.currentClue === 4;

    if (isRound4LastClue) {
      submission.timeTaken = timeTaken;
      await submission.save();
      await team.save();

      return res.json({
        message: 'Code verified! Please submit your photo to complete Round 4.',
        requiresPhoto: true,
        round: team.currentRound
      });
    }

    // Get next clue
    const nextClue = await getNextClue(team);

    if (nextClue) {
      if (nextClue.round > team.currentRound) {
        // New round → must use string key
        team.roundStartTimes.set(String(nextClue.round), new Date());
        team.currentRound = nextClue.round;
        team.currentClue = 1;
      } else {
        team.currentClue = nextClue.clueNumber;
      }
    } else {
      team.status = 'winner';
    }

    // Calculate and update round time
    const updatedRoundKey = String(team.currentRound);
    const roundTime = calculateRoundTime(team, team.currentRound);

    team.roundTimes.set(updatedRoundKey, roundTime); // FIXED: string key
    team.totalTime += roundTime;

    submission.timeTaken = timeTaken;
    await submission.save();
    await team.save();

    const io = getIO();
    if (io) io.to('admin').emit('teamUpdate', {
      teamId: team._id,
      teamName: team.teamName,
      currentRound: team.currentRound,
      currentClue: team.currentClue,
      status: team.status,
      totalTime: team.totalTime
    });

    res.json({
      message: 'Code verified! Next clue unlocked.',
      nextClue: nextClue
        ? {
            round: nextClue.round,
            clueNumber: nextClue.clueNumber
          }
        : null,
      progress: {
        currentRound: team.currentRound,
        currentClue: team.currentClue,
        status: team.status
      }
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const submitPhoto = async (req, res) => {
  try {
    const team = req.team;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Photo is required' });
    }

    if (team.status === 'eliminated') {
      return res.status(403).json({ message: 'Team has been eliminated' });
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    
    // Add photo to team's submitted photos
    team.submittedPhotos.push({
      round: team.currentRound,
      photoUrl,
      submittedAt: new Date()
    });

    // If Round 4, complete the round and check for advancement
    if (team.currentRound === 4) {
      const roundTime = calculateRoundTime(team, 4);
      team.roundTimes.set(4, roundTime);
      team.totalTime += roundTime;
      
      // Move to Round 5
      team.currentRound = 5;
      team.currentClue = 1;
      team.roundStartTimes.set(5, new Date());
    }

    await team.save();

    // Emit update to admin
    const io = getIO();
    if (io) io.to('admin').emit('teamUpdate', {
      teamId: team._id,
      teamName: team.teamName,
      currentRound: team.currentRound,
      currentClue: team.currentClue,
      status: team.status,
      totalTime: team.totalTime,
      photoSubmitted: true
    });

    res.json({
      message: 'Photo submitted successfully!',
      progress: {
        currentRound: team.currentRound,
        currentClue: team.currentClue,
        status: team.status
      }
    });
  } catch (error) {
    console.error('Submit photo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTeamProgress = async (req, res) => {
  try {
    const team = req.team;
    
    const elapsedTime = Math.floor((Date.now() - team.startTime) / 1000);
    
    res.json({
      teamName: team.teamName,
      currentRound: team.currentRound,
      currentClue: team.currentClue,
      status: team.status,
      totalTime: team.totalTime,
      elapsedTime,
      rank: team.rank,
      completedClues: team.completedClues.length,
      roundTimes: Object.fromEntries(team.roundTimes),
      submittedPhotos: team.submittedPhotos
    });
  } catch (error) {
    console.error('Get team progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

