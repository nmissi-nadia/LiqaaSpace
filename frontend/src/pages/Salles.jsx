import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import SalleForm from '../components/salles/SalleForm';
import api from '../services/api';

const Salles = () => {
  const [salles, setSalles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingSalle, setEditingSalle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchSalles();
  }, []);

  const fetchSalles = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/salles');
      setSalles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
      showSnackbar('Erreur lors du chargement des salles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (salle = null) => {
    setEditingSalle(salle);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingSalle(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingSalle) {
        await api.put(`/salles/${editingSalle.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showSnackbar('Salle mise à jour avec succès', 'success');
      } else {
        await api.post('/salles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        showSnackbar('Salle créée avec succès', 'success');
      }
      handleClose();
      fetchSalles();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showSnackbar(error.response?.data?.message || 'Une erreur est survenue', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      try {
        await api.delete(`/salles/${id}`);
        showSnackbar('Salle supprimée avec succès', 'success');
        fetchSalles();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showSnackbar('Erreur lors de la suppression de la salle', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && salles.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Gestion des salles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Ajouter une salle
        </Button>
      </Box>

      <Grid container spacing={3}>
        {salles.map((salle) => (
          <Grid item xs={12} sm={6} md={4} key={salle.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {salle.images?.[0] && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://127.0.0.1:8000/storage/${salle.images[0]}`}
                  alt={salle.nom}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {salle.nom}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {salle.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Lieu:</strong> {salle.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Capacité:</strong> {salle.capacite} personnes
                </Typography>
                <Typography 
                  variant="body2" 
                  color={salle.status === 'active' ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {salle.status === 'active' ? 'Disponible' : 'Indisponible'}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton 
                  color="primary" 
                  onClick={() => handleOpen(salle)}
                  aria-label="Modifier"
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  color="error" 
                  onClick={() => handleDelete(salle.id)}
                  aria-label="Supprimer"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingSalle ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
        </DialogTitle>
        <DialogContent>
          <SalleForm
            salle={editingSalle}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Salles;