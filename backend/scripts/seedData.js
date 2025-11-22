import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Team from '../models/Team.js';
import Clue from '../models/Clue.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/treasure-hunt');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Team.deleteMany({});
    await Clue.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing data');

    // Create admin
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    await admin.save();
    console.log('✅ Admin created (username: admin, password: admin123)');

    // Create 10 teams
    const teams = [];
    const teamCodes = ['TEAM01', 'TEAM02', 'TEAM03', 'TEAM04', 'TEAM05', 'TEAM06', 'TEAM07', 'TEAM08', 'TEAM09', 'TEAM10'];
    
    for (let i = 0; i < 10; i++) {
      // Store plain code - the pre-save hook will hash it
      const team = new Team({
        teamName: `Team ${i + 1}`,
        teamCode: teamCodes[i],
        hashedCode: teamCodes[i], // Store plain code, pre-save hook will hash
        currentRound: 1,
        currentClue: 1,
        status: 'active'
      });
      await team.save();
      teams.push(team);
    }
    console.log('✅ Created 10 teams');

    // Create clues for Round 1-4 (4 clues per round, different for each team)
    for (let round = 1; round <= 4; round++) {
      for (let clueNum = 1; clueNum <= 4; clueNum++) {
        for (let teamIndex = 0; teamIndex < 10; teamIndex++) {
          const difficulty = round <= 2 ? 'easy' : 'medium';
          const answerCode = `CODE${round}${clueNum}${teamIndex + 1}`;
          const hashedCode = await bcrypt.hash(answerCode.toLowerCase().trim(), 10);
          
          const clue = new Clue({
            round,
            clueNumber: clueNum,
            difficulty,
            clueText: `Round ${round} - Clue ${clueNum} for Team ${teamIndex + 1}\n\nFind the hidden message at the location marked on your map. Look for the symbol that matches your team color.`,
            answerCode: answerCode,
            hashedAnswerCode: hashedCode,
            location: `Location ${round}-${clueNum}-${teamIndex + 1}`,
            assignedTeams: [teams[teamIndex]._id],
            isActive: true
          });
          await clue.save();
        }
      }
    }
    console.log('✅ Created clues for Rounds 1-4');

    // Create Round 5 clues (pairing logic)
    // Pair 1: Team 1 vs Team 2
    const pair1AnswerCode = 'PAIR1CODE';
    const pair1Code = await bcrypt.hash(pair1AnswerCode.toLowerCase().trim(), 10);
    const pair1Clue = new Clue({
      round: 5,
      clueNumber: 1,
      difficulty: 'medium',
      clueText: 'Round 5 - Pair 1 Clue\n\nYou and your opponent face the same challenge. The first to solve advances.',
      answerCode: pair1AnswerCode,
      hashedAnswerCode: pair1Code,
      location: 'Pair 1 Location',
      assignedTeams: [teams[0]._id, teams[1]._id],
      isShared: true,
      isActive: true
    });
    await pair1Clue.save();

    // Pair 2: Team 3 vs Team 4
    const pair2AnswerCode = 'PAIR2CODE';
    const pair2Code = await bcrypt.hash(pair2AnswerCode.toLowerCase().trim(), 10);
    const pair2Clue = new Clue({
      round: 5,
      clueNumber: 1,
      difficulty: 'medium',
      clueText: 'Round 5 - Pair 2 Clue\n\nYou and your opponent face the same challenge. The first to solve advances.',
      answerCode: pair2AnswerCode,
      hashedAnswerCode: pair2Code,
      location: 'Pair 2 Location',
      assignedTeams: [teams[2]._id, teams[3]._id],
      isShared: true,
      isActive: true
    });
    await pair2Clue.save();

    // Unique: Team 5
    const uniqueAnswerCode = 'UNIQUECODE';
    const uniqueCode = await bcrypt.hash(uniqueAnswerCode.toLowerCase().trim(), 10);
    const uniqueClue = new Clue({
      round: 5,
      clueNumber: 1,
      difficulty: 'medium',
      clueText: 'Round 5 - Unique Clue\n\nYou face this challenge alone. Solve it to advance.',
      answerCode: uniqueAnswerCode,
      hashedAnswerCode: uniqueCode,
      location: 'Unique Location',
      assignedTeams: [teams[4]._id],
      isActive: true
    });
    await uniqueClue.save();
    console.log('✅ Created clues for Round 5');

    // Create Round 6 clue (shared by all 3 teams)
    const round6AnswerCode = 'ROUND6CODE';
    const round6Code = await bcrypt.hash(round6AnswerCode.toLowerCase().trim(), 10);
    const round6Clue = new Clue({
      round: 6,
      clueNumber: 1,
      difficulty: 'medium',
      clueText: 'Round 6 - Final Three\n\nAll three remaining teams face the same challenge. The first two to solve advance to the final round.',
      answerCode: round6AnswerCode,
      hashedAnswerCode: round6Code,
      location: 'Round 6 Location',
      isShared: true,
      isActive: true
    });
    await round6Clue.save();
    console.log('✅ Created clue for Round 6');

    // Create Round 7 clue (final battle)
    const round7AnswerCode = 'FINALCODE';
    const round7Code = await bcrypt.hash(round7AnswerCode.toLowerCase().trim(), 10);
    const round7Clue = new Clue({
      round: 7,
      clueNumber: 1,
      difficulty: 'hard',
      clueText: 'Round 7 - Final Battle\n\nThis is it! The ultimate challenge. Solve this layered riddle and submit the correct photo to claim victory.\n\n"Where time stands still, yet moments pass,\nWhere shadows dance, but light will last,\nFind the symbol of unity and strength,\nCapture it now, at any length."',
      answerCode: round7AnswerCode,
      hashedAnswerCode: round7Code,
      location: 'Final Location',
      isShared: true,
      isActive: true
    });
    await round7Clue.save();
    console.log('✅ Created clue for Round 7');

    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('Admin: username=admin, password=admin123');
    console.log('Teams: Use team codes TEAM01 through TEAM10');
    console.log('Test codes: CODE111, CODE112, etc. (format: CODE{round}{clue}{team})');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

