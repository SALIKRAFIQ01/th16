import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';
import toast from 'react-hot-toast';

const PhotoUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      toast.error('Please select a photo');
      return;
    }

    setLoading(true);

    try {
      await teamAPI.submitPhoto(photo);
      toast.success('Photo submitted successfully!');
      setTimeout(() => {
        navigate('/team/dashboard');
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Photo upload failed';
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
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">Submit Photo</h1>
            <p className="text-gray-600">Upload a photo as required for this round</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
                Select Photo
              </label>
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg border border-gray-300"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !photo}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Submit Photo'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Maximum file size is 5MB. Supported formats: JPG, PNG, GIF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;

