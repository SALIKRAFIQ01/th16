import jwt from 'jsonwebtoken';
import Team from '../models/Team.js';
import Admin from '../models/Admin.js';

const JWT_SECRET = "secretkeygeneratedbytawheedtariq####$$$$^^^*(*^(";

export const authenticateTeam = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token,JWT_SECRET);
    
    if (decoded.type !== 'team') {
      return res.status(403).json({ message: 'Invalid token type' });
    }

    const team = await Team.findById(decoded.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    req.team = team;
    req.teamId = team._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token,JWT_SECRET);
    
    if (decoded.type !== 'admin') {
      return res.status(403).json({ message: 'Invalid token type' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    req.adminId = admin._id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

