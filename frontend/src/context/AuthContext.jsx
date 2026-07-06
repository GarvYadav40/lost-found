import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useApi } from '../hooks/useApi';
import { fetchCurrentUser } from '../services/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isSignedIn } = useAuth();
  const api = useApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!isSignedIn) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetchCurrentUser(api);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [api, isSignedIn]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return (
    <AuthContext.Provider value={{ profile, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useProfile must be used within an AuthProvider');
  }
  return context;
};
