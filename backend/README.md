# Treasure Hunt Backend

Express.js backend server for the Treasure Hunt Portal.

## Setup

1. Install dependencies: `npm install`
2. Create `.env` file (see `.env.example`)
3. Seed data: `node scripts/seedData.js`
4. Start server: `npm start` or `npm run dev`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration (default: 7d)
- `FRONTEND_URL`: Frontend URL for CORS

## API Documentation

See main README.md for complete API documentation.

