import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token is still valid by fetching user data
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      if (userType === 'team') {
        const response = await axios.get('/api/team/progress');
        setUser(response.data);
      } else if (userType === 'admin') {
        // Admin data is stored in token, no need to fetch
        setUser({ type: 'admin' });
      }
    } catch (error) {
      // Token invalid, clear auth
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, newUserType, userData) => {
    setToken(newToken);
    setUserType(newUserType);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userType', newUserType);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUserType(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    userType,
    loading,
    login,
    logout,
    fetchUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

