# Quick Start Guide

## Prerequisites
- Node.js installed
- MongoDB running (local or remote)

## Step 1: Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/treasure-hunt
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

Seed data:
```bash
node scripts/seedData.js
```

Start server:
```bash
npm start
```

## Step 2: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Step 3: Access the Application

- **Team Portal**: http://localhost:5173/team/login
- **Admin Dashboard**: http://localhost:5173/admin/login

## Default Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Teams:**
- Team Codes: `TEAM01` through `TEAM10`

## Test Codes

Format: `CODE{round}{clue}{team}`
- Example: `CODE111` = Round 1, Clue 1, Team 1
- Example: `CODE234` = Round 2, Clue 3, Team 4

## Next Steps

1. Log in as admin to view all teams
2. Log in as a team to start playing
3. Submit codes to progress through rounds
4. Monitor progress in real-time on admin dashboard

