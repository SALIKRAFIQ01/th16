# Fix Instructions for Login Issues

## Problem
The team codes and clue codes were being double-hashed, causing login failures.

## Solution Options

### Option 1: Re-seed Database (Recommended - Clean Start)
This will delete all existing data and create fresh teams and clues with properly hashed codes.

```bash
cd backend
# Make sure MongoDB is running
node scripts/seedData.js
```

### Option 2: Fix Existing Database
This will fix the hashed codes in your existing database without deleting data.

```bash
cd backend
node scripts/fixHashedCodes.js
```

## After Fixing

1. **Test Team Login:**
   - Go to: http://localhost:5173/team/login
   - Use team codes: `TEAM01`, `TEAM02`, etc. (through `TEAM10`)

2. **Test Clue Codes:**
   - Format: `CODE{round}{clue}{team}`
   - Example: `CODE111` = Round 1, Clue 1, Team 1
   - Example: `CODE234` = Round 2, Clue 3, Team 4

3. **Test Admin Login:**
   - Username: `admin`
   - Password: `admin123`

## What Was Fixed

1. ✅ Team model pre-save hook now checks if code is already hashed
2. ✅ Code verification re-enabled in auth controller
3. ✅ Seed script updated to work correctly
4. ✅ All clue codes properly formatted

## If Issues Persist

1. Check MongoDB is running: `mongosh` or check your connection string
2. Clear browser cache and localStorage
3. Check backend console for error messages
4. Verify `.env` file has correct MongoDB URI

