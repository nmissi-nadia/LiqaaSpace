import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Intercepteur pour gérer le CSRF
api.interceptors.request.use(
  async (config) => {
    // Ne pas ajouter le header pour la requête CSRF
    if (config.url.includes('sanctum/csrf-cookie')) {
      return config;
    }
    
    // Vérifier si on a déjà un token CSRF
    if (!document.cookie.includes('XSRF-TOKEN')) {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true
      });
    }
    
    // Récupérer le token CSRF depuis les cookies
    const xsrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    
    if (xsrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gestion des erreurs
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 419) {
      if (window.location.pathname !== '/dashboard') {
        window.location.href = '/dashboard';
      }
    }
    return Promise.reject(error);
  }
);

export default api;