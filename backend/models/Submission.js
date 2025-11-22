import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  clueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clue',
    required: true
  },
  round: {
    type: Number,
    required: true
  },
  submissionType: {
    type: String,
    enum: ['code', 'photo'],
    required: true
  },
  submittedCode: {
    type: String
  },
  photoUrl: {
    type: String
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  timeTaken: {
    type: Number
  }
}, {
  timestamps: true
});

export default mongoose.model('Submission', submissionSchema);

