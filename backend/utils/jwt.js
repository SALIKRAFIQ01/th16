import jwt from 'jsonwebtoken';
const JWT_SECRET = "secretkeygeneratedbytawheedtariq####$$$$^^^*(*^("
export const generateTeamToken = (teamId) => {
  return jwt.sign(
    { id: teamId, type: 'team' },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const generateAdminToken = (adminId) => {
  return jwt.sign(
    { id: adminId, type: 'admin' },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

