import mongoose from 'mongoose';

const clueSchema = new mongoose.Schema({
  round: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  clueNumber: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  clueText: {
    type: String,
    required: true
  },
  answerCode: {
    type: String,
    required: true
  },
  hashedAnswerCode: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  hints: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  assignedTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  isShared: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Clue', clueSchema);

