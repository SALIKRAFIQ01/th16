import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  teamCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  hashedCode: {
    type: String,
    required: true
  },
  currentRound: {
    type: Number,
    default: 1,
    min: 1,
    max: 7
  },
  currentClue: {
    type: Number,
    default: 1
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  roundStartTimes: {
    type: Map,
    of: Date,
    default: new Map()
  },
  roundTimes: {
    type: Map,
    of: Number,
    default: new Map()
  },
  totalTime: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'eliminated', 'winner', 'finalist'],
    default: 'active'
  },
  eliminatedAt: {
    type: Number,
    default: null
  },
  rank: {
    type: Number,
    default: null
  },
  submittedPhotos: [{
    round: Number,
    photoUrl: String,
    submittedAt: Date
  }],
  completedClues: [{
    clueId: mongoose.Schema.Types.ObjectId,
    round: Number,
    clueNumber: Number,
    completedAt: Date
  }]
}, {
  timestamps: true
});

// Hash team code before saving (only if it's not already hashed)
teamSchema.pre('save', async function(next) {
  if (!this.isModified('hashedCode')) return next();
  // Check if already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (this.hashedCode && /^\$2[ayb]\$.{56}$/.test(this.hashedCode)) {
    return next(); // Already hashed, skip
  }
  this.hashedCode = await bcrypt.hash(this.hashedCode, 10);
  next();
});

// Method to verify team code
teamSchema.methods.verifyCode = async function(code) {
  return await bcrypt.compare(code, this.hashedCode);
};

export default mongoose.model('Team', teamSchema);

