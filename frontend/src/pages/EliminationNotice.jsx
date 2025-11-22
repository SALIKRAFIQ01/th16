import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';

const EliminationNotice = () => {
  const { user, logout } = useAuth();
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
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Team Eliminated</h1>
          <p className="text-gray-600">Unfortunately, your team has been eliminated from the competition.</p>
        </div>

        <div className="bg-red-50 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold text-red-800">
            {progress?.teamName}
          </p>
          <p className="text-red-600 mt-2">
            Eliminated at Round {progress?.eliminatedAt}
          </p>
          {progress?.rank && (
            <p className="text-red-600 mt-2">
              Final Rank: #{progress.rank}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700">
            Thank you for participating in the Treasure Hunt! Your progress and efforts are appreciated.
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default EliminationNotice;

