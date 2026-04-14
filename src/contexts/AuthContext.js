import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('whichrenewables_auth');
    const savedUser = localStorage.getItem('whichrenewables_user');

    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const token = localStorage.getItem('authToken');
      if (token && parsedUser.role !== 'admin') {
        fetch(`${API_BASE_URL}/companies/my-company`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              const plan = data.data.subscription?.plan;
              const planName = typeof plan === 'string' ? plan : plan?.name || 'not_subscribed';
              const updatedUser = {
                ...parsedUser,
                id: data.data.id, // Ensure id is present
                companyId: data.data.id, // Explicitly set companyId
                companyName: data.data.companyName,
                website: data.data.website || data.data.companyWebsite || data.data.websiteLink || parsedUser.website || '',
                companyWebsite: data.data.companyWebsite || data.data.websiteLink || parsedUser.companyWebsite || '',
                subscription: planName.toLowerCase()
              };
              setUser(updatedUser);
              localStorage.setItem('whichrenewables_user', JSON.stringify(updatedUser));
            }
          })
          .catch(err => console.error('Error fetching company data:', err));
      }
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('whichrenewables_auth', 'true');
    localStorage.setItem('whichrenewables_user', JSON.stringify(userData));
    refreshUser(userData);
  };

  const refreshUser = (currentUser = user) => {
    if (!currentUser) return;
    
    // Fetch company data immediately after login to ensure correct dropdown display
    const token = localStorage.getItem('authToken');
    if (token && currentUser.role !== 'admin') {
      fetch(`${API_BASE_URL}/companies/my-company`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            const plan = data.data.subscription?.plan;
            const planName = typeof plan === 'string' ? plan : plan?.name || 'not_subscribed';
            const updatedUser = {
              ...currentUser,
              id: data.data.id, // Ensure id is present
              companyId: data.data.id, // Explicitly set companyId
              companyName: data.data.companyName,
              website: data.data.website || data.data.companyWebsite || data.data.websiteLink || currentUser.website || '',
              companyWebsite: data.data.companyWebsite || data.data.websiteLink || currentUser.companyWebsite || '',
              subscription: planName.toLowerCase()
            };
            setUser(updatedUser);
            localStorage.setItem('whichrenewables_user', JSON.stringify(updatedUser));
          }
        })
        .catch(err => console.error('Error fetching company data on login:', err));
    }
  }

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('whichrenewables_auth');
    localStorage.removeItem('whichrenewables_user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
