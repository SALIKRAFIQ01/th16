import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchData();
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const initializeSocket = () => {
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('joinAdminRoom');
    });

    newSocket.on('teamUpdate', (data) => {
      fetchData(); // Refresh data on update
      toast.success(`Team ${data.teamName} updated`, { duration: 2000 });
    });

    newSocket.on('roundCompletion', (data) => {
      fetchData();
      toast.success(`Round ${data.round} completed!`, { duration: 3000 });
    });

    newSocket.on('gameComplete', (data) => {
      fetchData();
      toast.success(`Game Complete! Winner: ${data.winner?.teamName}`, { duration: 5000 });
    });

    setSocket(newSocket);
  };

  const fetchData = async () => {
    try {
      const [teamsResponse, statsResponse] = await Promise.all([
        adminAPI.getAllTeams(),
        adminAPI.getGameStats()
      ]);
      setTeams(teamsResponse.data.teams);
      setStats(statsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTriggerRound4 = async () => {
    if (!window.confirm('Are you sure you want to trigger Round 4 completion?')) return;
    try {
      await adminAPI.triggerRound4Completion();
      toast.success('Round 4 completion triggered');
      fetchData();
    } catch (error) {
      toast.error('Failed to trigger Round 4 completion');
    }
  };

  const handleTriggerRound6 = async () => {
    if (!window.confirm('Are you sure you want to trigger Round 6 advancement?')) return;
    try {
      await adminAPI.triggerRound6Advancement();
      toast.success('Round 6 advancement triggered');
      fetchData();
    } catch (error) {
      toast.error('Failed to trigger Round 6 advancement');
    }
  };

  const handleTriggerRound7 = async () => {
    if (!window.confirm('Are you sure you want to trigger Round 7 winner determination?')) return;
    try {
      await adminAPI.triggerRound7Winner();
      toast.success('Round 7 winner determined');
      fetchData();
    } catch (error) {
      toast.error('Failed to trigger Round 7 winner');
    }
  };

  const handleOverrideElimination = async (teamId) => {
    if (!window.confirm('Override elimination for this team?')) return;
    try {
      await adminAPI.overrideElimination(teamId);
      toast.success('Elimination overridden');
      fetchData();
    } catch (error) {
      toast.error('Failed to override elimination');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const activeTeams = teams.filter(t => t.status === 'active' || t.status === 'finalist');
  const eliminatedTeams = teams.filter(t => t.status === 'eliminated');

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">Admin Dashboard</h1>
              <p className="text-gray-600">Real-time team monitoring</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Teams</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.totalTeams}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Teams</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeTeams}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Eliminated</h3>
              <p className="text-3xl font-bold text-red-600">{stats.eliminatedTeams}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Finalists</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.finalists}</p>
            </div>
          </div>
        )}

        {/* Game Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Game Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleTriggerRound4}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Trigger Round 4 Completion
            </button>
            <button
              onClick={handleTriggerRound6}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Trigger Round 6 Advancement
            </button>
            <button
              onClick={handleTriggerRound7}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Determine Round 7 Winner
            </button>
          </div>
        </div>

        {/* Active Teams */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Active Teams ({activeTeams.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Team</th>
                  <th className="text-left p-2">Round</th>
                  <th className="text-left p-2">Clue</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Total Time</th>
                  <th className="text-left p-2">Elapsed</th>
                  <th className="text-left p-2">Rank</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTeams.map((team) => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold">{team.teamName}</td>
                    <td className="p-2">{team.currentRound}</td>
                    <td className="p-2">{team.currentClue}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        team.status === 'active' ? 'bg-green-100 text-green-800' :
                        team.status === 'finalist' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                    </td>
                    <td className="p-2">{formatTime(team.totalTime)}</td>
                    <td className="p-2">{formatTime(team.elapsedTime)}</td>
                    <td className="p-2">{team.rank || '-'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => setSelectedTeam(team.id)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Eliminated Teams */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Eliminated Teams ({eliminatedTeams.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Team</th>
                  <th className="text-left p-2">Eliminated At</th>
                  <th className="text-left p-2">Final Rank</th>
                  <th className="text-left p-2">Total Time</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {eliminatedTeams.map((team) => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold">{team.teamName}</td>
                    <td className="p-2">Round {team.eliminatedAt}</td>
                    <td className="p-2">#{team.rank}</td>
                    <td className="p-2">{formatTime(team.totalTime)}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleOverrideElimination(team.id)}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Override
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team Details Modal */}
        {selectedTeam && (
          <TeamDetailsModal
            teamId={selectedTeam}
            onClose={() => setSelectedTeam(null)}
            onUpdate={fetchData}
          />
        )}
      </div>
    </div>
  );
};

const TeamDetailsModal = ({ teamId, onClose, onUpdate }) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamDetails();
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await adminAPI.getTeamDetails(teamId);
      setTeam(response.data);
    } catch (error) {
      toast.error('Failed to fetch team details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await adminAPI.updateTeamStatus(teamId, { status });
      toast.success('Team status updated');
      onUpdate();
      fetchTeamDetails();
    } catch (error) {
      toast.error('Failed to update team status');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-600">Team Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {team && (
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Team Name:</p>
              <p>{team.teamName}</p>
            </div>
            <div>
              <p className="font-semibold">Team Code:</p>
              <p>{team.teamCode}</p>
            </div>
            <div>
              <p className="font-semibold">Current Round:</p>
              <p>{team.currentRound}</p>
            </div>
            <div>
              <p className="font-semibold">Current Clue:</p>
              <p>{team.currentClue}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <p>{team.status}</p>
            </div>
            <div>
              <p className="font-semibold">Total Time:</p>
              <p>{Math.floor(team.totalTime / 60)}:{(team.totalTime % 60).toString().padStart(2, '0')}</p>
            </div>
            <div>
              <p className="font-semibold">Completed Clues:</p>
              <p>{team.completedClues?.length || 0}</p>
            </div>

            <div className="mt-6">
              <p className="font-semibold mb-2">Update Status:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateStatus('active')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Set Active
                </button>
                <button
                  onClick={() => handleUpdateStatus('eliminated')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Set Eliminated
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

