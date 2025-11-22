import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const ClueDisplay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clue, setClue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClue();
  }, []);

  const fetchClue = async () => {
    try {
      const response = await teamAPI.getCurrentClue();
      if (response.data && response.data.clue) {
        setClue(response.data.clue);
      } else {
        toast.error('No clue data received');
        navigate('/team/dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch clue';
      console.error('Clue fetch error:', error);
      toast.error(errorMessage);
      setTimeout(() => {
        navigate('/team/dashboard');
      }, 2000);
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/team/dashboard')}
              className="text-indigo-600 hover:underline mb-4"
            >
              ← Back to Dashboard
            </button>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-indigo-600">Current Clue</h1>
              <div className="text-right">
                <p className="text-sm text-gray-600">Round {clue?.round}</p>
                <p className="text-sm text-gray-600">Clue {clue?.clueNumber}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              clue?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              clue?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {clue?.difficulty?.toUpperCase()}
            </span>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-800 whitespace-pre-line leading-relaxed">
              {clue?.clueText}
            </p>
          </div>

          {clue?.location && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="font-semibold text-yellow-800">Location:</p>
              <p className="text-yellow-700">{clue.location}</p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/team/code')}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Submit Code
            </button>
            <button
              onClick={() => navigate('/team/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClueDisplay;

