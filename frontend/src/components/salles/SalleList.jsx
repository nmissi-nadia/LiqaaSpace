import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import api from '../../services/api';

const SalleList = () => {
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    salleId: null,
    salleName: ''
  });

  useEffect(() => {
    const fetchSalles = async () => {
      try {
        const response = await api.get('/salles');
        console.log(response.data);
        setSalles(response.data.data || response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des salles:', err);
        setError('Impossible de charger les salles. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalles();
  }, []);

  const handleDeleteClick = (salleId, salleName) => {
    setDeleteDialog({
      open: true,
      salleId,
      salleName
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/salles/${deleteDialog.salleId}`);
      setSalles(salles.filter(salle => salle.id !== deleteDialog.salleId));
      setDeleteDialog({
        open: false,
        salleId: null,
        salleName: ''
      });
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la salle');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      open: false,
      salleId: null,
      salleName: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Liste des salles
        </Typography>
        <Button 
          component={Link} 
          to="/salles/nouveau" 
          variant="contained" 
          color="primary"
        >
          Ajouter une salle
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Localisation</TableCell>
                <TableCell>Capacité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Responsable</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salles.length > 0 ? (
                salles.map((salle) => (
                  <TableRow key={salle.id}>
                    <TableCell>{salle.nom}</TableCell>
                    <TableCell>{salle.location}</TableCell>
                    <TableCell>{salle.capacite} personnes</TableCell>
                    <TableCell>
                      <Chip 
                        label={salle.status === 'active' ? 'Active' : 'Inactive'} 
                        color={getStatusColor(salle.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      {salle.responsable?.name || `ID: ${salle.responsable_id}`}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        component={Link} 
                        to={`/salles/${salle.id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton 
                        component={Link} 
                        to={`/salles/${salle.id}/modifier`}
                        color="primary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteClick(salle.id, salle.nom)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Aucune salle trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer la salle "{deleteDialog.salleName}" ? 
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalleList;