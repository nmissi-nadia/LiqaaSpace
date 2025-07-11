import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('api/user');  
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.get('/sanctum/csrf-cookie',{withCredentials: true});
      
      const response = await api.post('api/login', { 
        email, 
        password 
      });
      localStorage.setItem('access_token', response.data.access_token);
      const userResponse = await api.get('api/user');  
      const userData = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setError(error.response?.data?.message || 'Échec de la connexion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('api/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        role: userData.role || 'collaborateur'
      });
      
      await api.post('api/login', {
        email: userData.email,
        password: userData.password
      });
      
      // Récupérer les infos utilisateur
      const userResponse = await api.get('api/user'); 
      setUser(userResponse.data);
      
      return true;
    } catch (error) {
      console.error('Erreur inscription:', error);
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('api/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('isAuthenticated');
      window.location.href = '/auth';
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;