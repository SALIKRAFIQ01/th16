import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import adminRoutes from './routes/admin.js';
import clueRoutes from './routes/clue.js';
import { initializeSocket } from './services/socketService.js';
import ip from 'ip';

dotenv.config();

// Setup filename & dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://treasurehunt-me.netlify.app",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://treasurehunt-me.netlify.app",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/clue', clueRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Treasure Hunt API is running' });
});

// Initialize socket service
initializeSocket(io);

// MongoDB Connection
const db_password = "Tawheedtariq";

mongoose.connect(`mongodb+srv://salikrbhat_db_user:${db_password}@cluster0.24kg8qw.mongodb.net/treasure-hunt`)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// -----------------------------
// 🚀 START SERVER (Render Fix)
// -----------------------------
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Local Network: http://${ip.address()}:${PORT}`);
});

export { io };
