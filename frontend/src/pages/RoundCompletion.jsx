import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';

const RoundCompletion = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await teamAPI.getProgress();
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch progress');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Round Complete!</h1>
          <p className="text-gray-600">Great job completing this round!</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold text-indigo-800">
            Round {progress?.currentRound - 1} completed successfully!
          </p>
          <p className="text-indigo-600 mt-2">
            You're now advancing to Round {progress?.currentRound}
          </p>
        </div>

        <button
          onClick={() => navigate('/team/dashboard')}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Continue to Next Round
        </button>
      </div>
    </div>
  );
};

export default RoundCompletion;

