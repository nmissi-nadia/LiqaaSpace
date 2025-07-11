import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
  }
});

// Intercepteur pour gérer le CSRF
api.interceptors.request.use(async (config) => {

  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase())) {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    });
    
    const token = document.querySelector('meta[name="csrf-token"]');;
      
    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }
  }
  return config;
});

// Gestion des erreurs
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 419) {
      // Si le token CSRF est invalide, on recharge la page
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;