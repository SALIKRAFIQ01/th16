import Team from '../models/Team.js';
import Admin from '../models/Admin.js';
import { generateTeamToken, generateAdminToken } from '../utils/jwt.js';
export const teamLogin = async (req, res) => {
  try {
    const { teamCode } = req.body;

    if (!teamCode) {
      return res.status(400).json({ message: 'Team code is required' });
    }

    const team = await Team.findOne({ teamCode: teamCode.toUpperCase().trim() });
    
    if (!team) {
      return res.status(401).json({ message: 'Invalid team code' });
    }

    // Verify code
    // const isValid = await team.verifyCode(teamCode.toUpperCase().trim());
    // if (!isValid) {
    //   return res.status(401).json({ message: 'Invalid team code' });
    // }

    // Check if team is eliminated
    if (team.status === 'eliminated') {
      return res.status(403).json({ 
        message: 'Team has been eliminated',
        eliminatedAt: team.eliminatedAt 
      });
    }

    const token = generateTeamToken(team._id);

    res.json({
      token,
      team: {
        id: team._id,
        teamName: team.teamName,
        currentRound: team.currentRound,
        currentClue: team.currentClue,
        status: team.status
      }
    });
  } catch (error) {
    console.error('Team login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await admin.verifyPassword(password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAdminToken(admin._id);

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

