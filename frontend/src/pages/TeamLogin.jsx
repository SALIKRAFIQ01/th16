import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const TeamLogin = () => {
  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.teamLogin(teamCode.toUpperCase().trim());
      const { token, team } = response.data;

      login(token, 'team', team);
      
      if (team.status === 'eliminated') {
        navigate('/team/eliminated');
      } else {
        navigate('/team/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Treasure Hunt</h1>
          <p className="text-gray-600">Team Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700 mb-2">
              Team Code
            </label>
            <input
              id="teamCode"
              type="text"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your team code"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin/login" className="text-sm text-indigo-600 hover:underline">
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamLogin;

