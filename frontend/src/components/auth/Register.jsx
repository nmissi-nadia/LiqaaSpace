import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, TextField, Button, Typography, 
  Container, Paper, MenuItem, Alert, CircularProgress 
} from '@mui/material';
import api from '../../services/api';

const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'collaborateur'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      // 1. Récupérer le cookie CSRF
      await api.get('/sanctum/csrf-cookie');
      
      // 2. Envoyer la requête d'inscription
      const response = await api.post('/register', formData);
      
      // 3. Si succès, rediriger vers la page de connexion
      onSuccess?.();
      navigate('/login', { 
        state: { 
          success: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' 
        } 
      });
      
    } catch (error) {
      console.error('Erreur inscription:', error);
      setError(
        error.response?.data?.message || 
        'Une erreur est survenue lors de l\'inscription'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Créer un compte
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nom complet"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {/* Ajoutez les autres champs ici */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'S\'inscrire'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;