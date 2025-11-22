# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Team Login
**POST** `/auth/team/login`

**Request Body:**
```json
{
  "teamCode": "TEAM01"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "team": {
    "id": "team_id",
    "teamName": "Team 1",
    "currentRound": 1,
    "currentClue": 1,
    "status": "active"
  }
}
```

### Admin Login
**POST** `/auth/admin/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Team Endpoints (Protected)

### Get Current Clue
**GET** `/team/clue`

**Response:**
```json
{
  "clue": {
    "id": "clue_id",
    "round": 1,
    "clueNumber": 1,
    "clueText": "Clue text here...",
    "location": "Location description",
    "difficulty": "easy"
  },
  "progress": {
    "currentRound": 1,
    "currentClue": 1,
    "status": "active"
  }
}
```

### Submit Code
**POST** `/team/code`

**Request Body:**
```json
{
  "code": "CODE111"
}
```

**Response:**
```json
{
  "message": "Code verified! Next clue unlocked.",
  "nextClue": {
    "round": 1,
    "clueNumber": 2
  },
  "progress": {
    "currentRound": 1,
    "currentClue": 2,
    "status": "active"
  }
}
```

### Submit Photo
**POST** `/team/photo`

**Request:** `multipart/form-data`
- Field: `photo` (file)

**Response:**
```json
{
  "message": "Photo submitted successfully!",
  "progress": {
    "currentRound": 5,
    "currentClue": 1,
    "status": "active"
  }
}
```

### Get Team Progress
**GET** `/team/progress`

**Response:**
```json
{
  "teamName": "Team 1",
  "currentRound": 1,
  "currentClue": 2,
  "status": "active",
  "totalTime": 3600,
  "elapsedTime": 7200,
  "rank": null,
  "completedClues": 1,
  "roundTimes": {
    "1": 3600
  },
  "submittedPhotos": []
}
```

---

## Admin Endpoints (Protected)

### Get All Teams
**GET** `/admin/teams`

**Response:**
```json
{
  "teams": [
    {
      "id": "team_id",
      "teamName": "Team 1",
      "currentRound": 1,
      "currentClue": 1,
      "status": "active",
      "startTime": "2024-01-01T00:00:00.000Z",
      "elapsedTime": 3600,
      "totalTime": 1800,
      "rank": null,
      "eliminatedAt": null,
      "completedClues": 0,
      "submittedPhotos": []
    }
  ]
}
```

### Get Team Details
**GET** `/admin/teams/:teamId`

**Response:**
```json
{
  "id": "team_id",
  "teamName": "Team 1",
  "teamCode": "TEAM01",
  "currentRound": 1,
  "currentClue": 1,
  "status": "active",
  "startTime": "2024-01-01T00:00:00.000Z",
  "elapsedTime": 3600,
  "totalTime": 1800,
  "rank": null,
  "eliminatedAt": null,
  "completedClues": [...],
  "submittedPhotos": [...],
  "roundTimes": {...},
  "roundStartTimes": {...}
}
```

### Update Team Status
**PATCH** `/admin/teams/:teamId/status`

**Request Body:**
```json
{
  "status": "active",
  "currentRound": 2,
  "currentClue": 1
}
```

**Response:**
```json
{
  "message": "Team updated successfully",
  "team": {...}
}
```

### Override Elimination
**POST** `/admin/teams/:teamId/override-elimination`

**Response:**
```json
{
  "message": "Elimination overridden",
  "team": {...}
}
```

### Trigger Round 4 Completion
**POST** `/admin/rounds/4/complete`

**Response:**
```json
{
  "message": "Round 4 completion processed",
  "teams": [...]
}
```

### Trigger Round 6 Advancement
**POST** `/admin/rounds/6/advance`

**Response:**
```json
{
  "message": "Round 6 advancement processed",
  "teams": [...]
}
```

### Determine Round 7 Winner
**POST** `/admin/rounds/7/winner`

**Response:**
```json
{
  "message": "Round 7 winner determined",
  "teams": [...]
}
```

### Get Game Statistics
**GET** `/admin/stats`

**Response:**
```json
{
  "totalTeams": 10,
  "activeTeams": 5,
  "eliminatedTeams": 5,
  "finalists": 0,
  "winner": null,
  "teamsByRound": {
    "1": 0,
    "2": 2,
    "3": 3,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0
  }
}
```

---

## Clue Management Endpoints (Admin)

### Get All Clues
**GET** `/clue`

**Response:**
```json
{
  "clues": [...]
}
```

### Get Clue by ID
**GET** `/clue/:clueId`

**Response:**
```json
{
  "clue": {...}
}
```

### Create Clue
**POST** `/clue`

**Request Body:**
```json
{
  "round": 1,
  "clueNumber": 1,
  "difficulty": "easy",
  "clueText": "Clue text here...",
  "answerCode": "CODE111",
  "location": "Location description",
  "hints": ["Hint 1", "Hint 2"],
  "assignedTeams": ["team_id_1", "team_id_2"]
}
```

### Update Clue
**PATCH** `/clue/:clueId`

**Request Body:**
```json
{
  "clueText": "Updated clue text",
  "answerCode": "NEWCODE"
}
```

### Delete Clue
**DELETE** `/clue/:clueId`

**Response:**
```json
{
  "message": "Clue deleted successfully"
}
```

### Assign Clue to Teams
**POST** `/clue/:clueId/assign`

**Request Body:**
```json
{
  "teamIds": ["team_id_1", "team_id_2"]
}
```

---

## WebSocket Events

### Client → Server
- `joinAdminRoom` - Join admin room for real-time updates

### Server → Client
- `teamUpdate` - Team progress updated
- `roundCompletion` - Round completed
- `gameComplete` - Game completed with winner

---

## Error Responses

All errors follow this format:

```json
{
  "message": "Error message here"
}
```

**Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes
- Code submission: 20 requests per 5 minutes
- General API: 30 requests per minute

