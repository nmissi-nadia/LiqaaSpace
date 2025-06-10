import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // URL de base sans slash final
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
    // Ignorer pour la route csrf-cookie
    if (config.url === 'sanctum/csrf-cookie') {
      return config;
    }

    // Si pas de token CSRF, on en récupère un
    if (!document.cookie.includes('XSRF-TOKEN')) {
      try {
        await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
          withCredentials: true
        });
      } catch (error) {
        console.error('Erreur CSRF:', error);
        return Promise.reject(error);
      }
    }

    // Ajouter le token CSRF aux requêtes
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
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
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;