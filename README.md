# Treasure Hunt Portal

A complete production-ready Treasure Hunt competition management system built with React (frontend) + Node.js + Express (backend) + MongoDB + JWT Authentication.

## 🎯 Features

### Authentication
- **Team Login**: Teams log in using unique team codes with JWT authentication
- **Admin Login**: Secure admin access with password + JWT
- **Secure Routing**: Role-based access control prevents unauthorized access
- **Password Hashing**: All passwords and team codes are securely hashed using bcrypt

### Team Portal
- **Clue Display**: View current clue with location and difficulty
- **Code Submission**: Submit verification codes found at clue locations
- **Photo Upload**: Submit photos for specific rounds (Round 4 & 7)
- **Progress Tracking**: Real-time progress display with elapsed time
- **Round Progression**: Automatic clue unlocking upon correct code submission
- **Responsive Design**: Mobile-first, fully responsive UI

### Game Logic
- **Rounds 1-4**: All 10 teams play with different clues per team
- **Round 4 Completion**: Photo submission required, ranking by total time
- **Top 5 Advancement**: Top 5 teams advance, bottom 5 eliminated
- **Round 5**: Pairing system (Team 1 vs 2, Team 3 vs 4, Team 5 unique)
- **Round 6**: All 3 teams get same clue, first 2 advance
- **Round 7**: Final battle between 2 teams, first to solve wins

### Admin Dashboard
- **Real-Time Monitoring**: Live updates via WebSocket (Socket.io)
- **Team Management**: View all teams with current status, round, clue, and time
- **Game Controls**: Trigger round completions and eliminations
- **Team Details**: View detailed team information and override eliminations
- **Statistics**: Real-time game statistics and team rankings

### Security
- JWT token-based authentication
- Password and code hashing with bcrypt
- Rate limiting on authentication and API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers

## 📁 Project Structure

```
treasure-hunt/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, rate limiting
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Socket.io service
│   ├── utils/           # Helper functions
│   ├── scripts/         # Seed data script
│   ├── uploads/         # Photo uploads directory
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   └── App.jsx      # Main app component
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/treasure-hunt
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Seed sample data:
```bash
node scripts/seedData.js
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults are set):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 Default Credentials

### Admin
- **Username**: `admin`
- **Password**: `admin123`

### Teams
- **Team Codes**: `TEAM01` through `TEAM10`
- **Test Codes**: Format `CODE{round}{clue}{team}` (e.g., `CODE111` for Round 1, Clue 1, Team 1)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/team/login` - Team login
- `POST /api/auth/admin/login` - Admin login

### Team Routes (Protected)
- `GET /api/team/clue` - Get current clue
- `POST /api/team/code` - Submit verification code
- `POST /api/team/photo` - Submit photo (multipart/form-data)
- `GET /api/team/progress` - Get team progress

### Admin Routes (Protected)
- `GET /api/admin/teams` - Get all teams
- `GET /api/admin/teams/:teamId` - Get team details
- `PATCH /api/admin/teams/:teamId/status` - Update team status
- `POST /api/admin/teams/:teamId/override-elimination` - Override elimination
- `POST /api/admin/rounds/4/complete` - Trigger Round 4 completion
- `POST /api/admin/rounds/6/advance` - Trigger Round 6 advancement
- `POST /api/admin/rounds/7/winner` - Determine Round 7 winner
- `GET /api/admin/stats` - Get game statistics

### Clue Management (Admin)
- `GET /api/clue` - Get all clues
- `GET /api/clue/:clueId` - Get clue by ID
- `POST /api/clue` - Create new clue
- `PATCH /api/clue/:clueId` - Update clue
- `DELETE /api/clue/:clueId` - Delete clue
- `POST /api/clue/:clueId/assign` - Assign clue to teams

## 🎮 Game Flow

1. **Teams Login**: Teams use their unique team codes to log in
2. **Round 1-4**: Teams solve clues by finding codes at locations
3. **Round 4 Photo**: After completing Round 4, teams submit a photo
4. **Ranking**: Teams ranked by total time, top 5 advance
5. **Round 5**: Pairing system - fastest from each pair advances
6. **Round 6**: All 3 teams get same clue, first 2 advance
7. **Round 7**: Final battle - first team to solve wins

## 🔒 Security Features

- JWT tokens with expiration
- Password hashing with bcrypt (10 rounds)
- Rate limiting on sensitive endpoints
- CORS protection
- Helmet.js security headers
- Input validation
- Role-based access control

## 📱 Real-Time Updates

The admin dashboard uses Socket.io for real-time updates:
- Team progress updates
- Round completion notifications
- Game completion alerts
- Live team status changes

## 🛠️ Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT (jsonwebtoken)
- bcryptjs
- Multer (file uploads)
- Helmet
- Express Rate Limit

### Frontend
- React 18
- React Router DOM
- Vite
- TailwindCSS
- Socket.io Client
- Axios
- React Hot Toast

## 📦 Building for Production

### Backend
```bash
cd backend
npm install --production
```

### Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## 🐛 Troubleshooting

1. **MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
2. **Port Already in Use**: Change PORT in `.env` file
3. **CORS Errors**: Check FRONTEND_URL in backend `.env`
4. **Socket.io Connection Failed**: Verify backend is running and CORS is configured

## 📄 License

This project is provided as-is for educational and commercial use.

## 👥 Support

For issues or questions, please check the code comments or create an issue in the repository.

---

**Built with ❤️ for Treasure Hunt competitions**

