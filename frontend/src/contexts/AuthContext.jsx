import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import axios from 'axios';
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

export const register = async (data) => {
  try {
    await axios.get('/sanctum/csrf-cookie');
    await axios.post('/register', data);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
 
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/user');
      const userData = Array.isArray(response.data) ? response.data[0] : response.data;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null); // si non connecté
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      axios.defaults.withCredentials = true;
      console.log('Tentative de connexion avec:', { email });
      setLoading(true);
      setError(null);
      
      console.log('Récupération du token CSRF...');
      const csrfResponse = await api.get('/sanctum/csrf-cookie');
      window.localStorage.setItem('csrfToken', csrfResponse.data.csrfToken);
      console.log('CSRF token récupéré');
      
      console.log('Tentative de connexion...');
      const loginResponse = await api.post('login', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      console.log('Réponse de connexion:', loginResponse.data);
      
      console.log('Récupération des informations utilisateur...');
      const userResponse = await api.get('/user');
      console.log('Utilisateur connecté:', userResponse.data);
      const userData = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;
setUser(userData);
      return true;
      
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
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
  
      console.log('Début de linscription...');
  
      const response = await api.post('/register', {
        name: userData.name.trim(),
        email: userData.email.trim(),
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        role: userData.role || 'collaborateur'
      });
  
      console.log('Inscription réussie:', response.data);
      
      await api.post('/login', {
        email: userData.email,
        password: userData.password
      });
  
      const userResponse = await api.get('/user');
      setUser(userResponse.data);
  
      return true;
  
    } catch (error) {
      console.error('Erreur inscription:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else {
        setError({
          general: error.response?.data?.message || 
                 'Erreur lors de l\'inscription'
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };
  

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await api.post('/logout');
      setUser(null);
      return true;
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
      return false;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;