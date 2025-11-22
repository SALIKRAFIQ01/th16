import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = "https://th16.onrender.com/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  teamLogin: (teamCode) => api.post('/auth/team/login', { teamCode }),
  adminLogin: (username, password) => api.post('/auth/admin/login', { username, password })
};

// Team API
export const teamAPI = {
  getCurrentClue: () => api.get('/team/clue'),
  submitCode: (code) => api.post('/team/code', { code }),
  submitPhoto: (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);
    return api.post('/team/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getProgress: () => api.get('/team/progress')
};

// Admin API
export const adminAPI = {
  getAllTeams: () => api.get('/admin/teams'),
  getTeamDetails: (teamId) => api.get(`/admin/teams/${teamId}`),
  updateTeamStatus: (teamId, data) => api.patch(`/admin/teams/${teamId}/status`, data),
  overrideElimination: (teamId) => api.post(`/admin/teams/${teamId}/override-elimination`),
  triggerRound4Completion: () => api.post('/admin/rounds/4/complete'),
  triggerRound6Advancement: () => api.post('/admin/rounds/6/advance'),
  triggerRound7Winner: () => api.post('/admin/rounds/7/winner'),
  getGameStats: () => api.get('/admin/stats'),
  getAllClues: () => api.get('/clue'),
  createClue: (data) => api.post('/clue', data),
  updateClue: (clueId, data) => api.patch(`/clue/${clueId}`, data),
  deleteClue: (clueId) => api.delete(`/clue/${clueId}`),
  assignClueToTeam: (clueId, teamIds) => api.post(`/clue/${clueId}/assign`, { teamIds })
};

export default api;

