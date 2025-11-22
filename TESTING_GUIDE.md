# Testing Guide - Treasure Hunt Portal

## Step 1: Re-seed Database

First, make sure to re-seed the database with the fixed code:

```bash
cd backend
node scripts/seedData.js
```

This will:
- Clear all existing data
- Create 10 teams (TEAM01 through TEAM10)
- Create clues for all rounds
- Properly assign clues to teams

## Step 2: Start Backend

```bash
cd backend
npm start
```

Backend should run on http://localhost:5000

## Step 3: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend should run on http://localhost:5173

## Step 4: Test Team Login

1. Go to http://localhost:5173/team/login
2. Enter team code: `TEAM01` (or any TEAM02-TEAM10)
3. Should successfully login and redirect to dashboard

## Step 5: Test Clue Fetching

1. After login, click "View Current Clue"
2. Should display:
   - Round 1, Clue 1
   - Clue text
   - Location
   - Difficulty

## Step 6: Test Code Submission

1. Go to "Submit Code" page
2. Enter code: `CODE111` (Round 1, Clue 1, Team 1)
   - Format: `CODE{round}{clue}{team}`
   - For Team 1: CODE111, CODE112, CODE113, CODE114
   - For Team 2: CODE121, CODE122, CODE123, CODE124
   - etc.
3. Should verify and unlock next clue

## Step 7: Test Admin Dashboard

1. Go to http://localhost:5173/admin/login
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. Should see all teams in real-time
4. Should see team progress updates

## Troubleshooting

### "Failed to fetch clue"
- Make sure database is seeded: `node scripts/seedData.js`
- Check backend console for errors
- Verify team is logged in correctly
- Check MongoDB connection

### "Invalid team code"
- Make sure teams are saved in database
- Check if team code verification is enabled in authController
- Re-seed database if needed

### "Clue not found"
- Verify clues exist in database
- Check team's currentRound and currentClue
- Make sure clues are assigned to the team
- Re-seed database

### Code verification fails
- Codes are case-insensitive
- Format: `CODE{round}{clue}{team}`
- Example: Team 1, Round 1, Clue 1 = `CODE111`
- Example: Team 2, Round 1, Clue 2 = `CODE122`

## Expected Behavior

1. **Team Login**: Should work with TEAM01-TEAM10
2. **Clue Display**: Should show current clue for team
3. **Code Submission**: Should verify and progress
4. **Photo Upload**: Should work for Round 4 and 7
5. **Admin Dashboard**: Should show real-time updates

## Database Verification

To check if data is correct:

```bash
# Connect to MongoDB
mongosh

# Use database
use treasure-hunt

# Check teams
db.teams.find().pretty()

# Check clues
db.clues.find({round: 1, clueNumber: 1}).pretty()

# Count clues per round
db.clues.countDocuments({round: 1})
```

