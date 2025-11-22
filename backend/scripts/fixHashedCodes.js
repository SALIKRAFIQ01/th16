import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team.js';
import Clue from '../models/Clue.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const fixHashedCodes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/treasure-hunt');
    console.log('Connected to MongoDB');

    // Fix team codes
    const teams = await Team.find();
    console.log(`Found ${teams.length} teams to fix`);
    
    for (const team of teams) {
      // Re-hash the team code properly (single hash)
      const plainCode = team.teamCode; // This is the plain code
      const properlyHashed = await bcrypt.hash(plainCode, 10);
      team.hashedCode = properlyHashed;
      await team.save();
      console.log(`Fixed team: ${team.teamName}`);
    }

    // Fix clue codes
    const clues = await Clue.find();
    console.log(`Found ${clues.length} clues to fix`);
    
    for (const clue of clues) {
      // We need to extract the original code from the clue
      // Since we can't reverse the hash, we'll need to regenerate based on the pattern
      // For clues, the answerCode field should have the plain code
      if (clue.answerCode && !clue.answerCode.startsWith('$2')) {
        // If answerCode is plain text, hash it properly
        const properlyHashed = await bcrypt.hash(clue.answerCode.toLowerCase().trim(), 10);
        clue.hashedAnswerCode = properlyHashed;
        await clue.save();
        console.log(`Fixed clue: Round ${clue.round}, Clue ${clue.clueNumber}`);
      }
    }

    console.log('\n✅ All codes fixed!');
    console.log('You can now login with team codes: TEAM01 through TEAM10');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing codes:', error);
    process.exit(1);
  }
};

fixHashedCodes();

