import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const CodeSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await teamAPI.submitCode(code);
      const { message, requiresPhoto, nextClue } = response.data;

      toast.success(message);

      if (requiresPhoto) {
        setTimeout(() => {
          navigate('/team/photo');
        }, 2000);
      } else if (nextClue) {
        setTimeout(() => {
          navigate('/team/clue');
        }, 2000);
      } else {
        setTimeout(() => {
          navigate('/team/dashboard');
        }, 2000);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Code submission failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/team/dashboard')}
              className="text-indigo-600 hover:underline mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">Submit Code</h1>
            <p className="text-gray-600">Enter the verification code you found at the clue location</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
                placeholder="Enter code"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Submit Code'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Make sure to enter the code exactly as you found it. Codes are case-insensitive.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSubmit;

