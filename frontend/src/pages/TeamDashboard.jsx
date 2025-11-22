import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const TeamDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await teamAPI.getProgress();
      setProgress(response.data);
      
      // Redirect based on status
      if (response.data.status === 'eliminated') {
        navigate('/team/eliminated');
      }
    } catch (error) {
      toast.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">{progress?.teamName}</h1>
              <p className="text-gray-600">Round {progress?.currentRound} - Clue {progress?.currentClue}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Time</h3>
            <p className="text-2xl font-bold text-indigo-600">{formatTime(progress?.totalTime || 0)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Elapsed Time</h3>
            <p className="text-2xl font-bold text-indigo-600">{formatTime(progress?.elapsedTime || 0)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Clues</h3>
            <p className="text-2xl font-bold text-indigo-600">{progress?.completedClues || 0}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/team/clue')}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Current Clue
            </button>
            <button
              onClick={() => navigate('/team/code')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Submit Code
            </button>
            {(progress?.currentRound === 4 || progress?.currentRound === 7) && (
              <button
                onClick={() => navigate('/team/photo')}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Submit Photo
              </button>
            )}
          </div>
        </div>

        {/* Round Progress */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Round Progress</h2>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((round) => (
              <div key={round} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    progress?.currentRound > round
                      ? 'bg-green-500 text-white'
                      : progress?.currentRound === round
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {round}
                </div>
                <div className="ml-4">
                  <p className="font-medium">
                    Round {round}
                    {progress?.currentRound === round && ' (Current)'}
                    {progress?.currentRound > round && ' ✓'}
                  </p>
                  {progress?.roundTimes?.[round] && (
                    <p className="text-sm text-gray-600">
                      Time: {formatTime(progress.roundTimes[round])}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;

