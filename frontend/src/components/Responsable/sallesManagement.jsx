// SallesManagement.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Chip, Tooltip, CircularProgress, Avatar
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Check as CheckIcon, Close as CloseIcon, 
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import api from '../../services/api';

const SallesManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    nom: '', 
    description: '', 
    capacite: 10, 
    location: 'Building A', 
    status: 'active',
    images: []
  });

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/salles');
      setRooms(response.data);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenDialog = (room = null) => {
    if (room) {
      setEditingRoom(room.id);
      setFormData({
        nom: room.nom,
        description: room.description || '',
        capacite: room.capacite,
        location: room.location,
        status: room.status,
        images: Array.isArray(room.images) ? room.images : []
      });
    } else {
      setFormData({
        nom: '',
        description: '',
        capacite: 10,
        location: 'Building A',
        status: 'active',
        images: []
      });
      setEditingRoom(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      alert('Vous ne pouvez télécharger que 5 images maximum');
      return;
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.some(file => !validTypes.includes(file.type));
    
    if (invalidFiles) {
      alert('Seuls les fichiers JPG, JPEG et PNG sont acceptés');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('nom', formData.nom);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('capacite', formData.capacite);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('status', formData.status);
    
    // Ajouter chaque image au FormData
    formData.images.forEach((image, index) => {
      if (image instanceof File) {
        formDataToSend.append(`images[${index}]`, image);
      } else if (image.url) {
        formDataToSend.append('existing_images[]', image.url);
      }
    });
  
    try {
      if (editingRoom) {
        await api.put(`/api/salles/${editingRoom}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/api/salles', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      handleCloseDialog();
      fetchRooms();
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(`Erreur lors de la sauvegarde: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      try {
        await api.delete(`/api/salles/${id}`);
        fetchRooms();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestion des Salles</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter une salle
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Capacité</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell>{room.nom}</TableCell>
                <TableCell>{room.description || '-'}</TableCell>
                <TableCell>{room.capacite} personnes</TableCell>
                <TableCell>{room.location}</TableCell>
                <TableCell>
                  <Chip
                    label={room.status}
                    color={room.status === 'active' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Modifier">
                    <IconButton onClick={() => handleOpenDialog(room)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton onClick={() => handleDeleteRoom(room.id)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog d'ajout/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingRoom ? 'Modifier la salle' : 'Ajouter une salle'}</DialogTitle>
          <DialogContent>
            <Box mt={2} display="grid" gap={2}>
              <TextField 
                name="nom" 
                label="Nom" 
                value={formData.nom} 
                onChange={handleInputChange} 
                fullWidth 
                required 
              />
              
              <TextField 
                name="description" 
                label="Description" 
                value={formData.description} 
                onChange={handleInputChange} 
                fullWidth 
                multiline
                rows={3}
              />
              
              <Box display="flex" gap={2} flexDirection="column">
                <TextField 
                  name="capacite" 
                  label="Capacité" 
                  type="number" 
                  value={formData.capacite} 
                  onChange={handleInputChange} 
                  fullWidth 
                  required 
                  inputProps={{ min: 1 }} 
                />
                
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={handleImageChange}
                  />
                  <label htmlFor="image-upload">
                    <Button 
                      variant="outlined" 
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      disabled={formData.images.length >= 5}
                    >
                      Ajouter des images ({formData.images.length}/5)
                    </Button>
                  </label>
                  
                  <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                    {(formData.images || []).map((image, index) => (
                      <Box key={index} position="relative">
                        <img 
                          src={image instanceof File ? URL.createObjectURL(image) : image.url} 
                          alt={`Aperçu ${index + 1}`} 
                          style={{ 
                            width: 100, 
                            height: 100, 
                            objectFit: 'cover',
                            borderRadius: 4
                          }} 
                        />
                        <IconButton
                          size="small"
                          style={{ 
                            position: 'absolute', 
                            top: -10, 
                            right: -10, 
                            backgroundColor: 'white',
                            padding: 4
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              <TextField
                name="location"
                label="Bâtiment"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                select
              >
                {['Bâtiment A', 'Bâtiment B', 'Bâtiment C', 'Bâtiment D'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                name="status"
                label="Statut"
                value={formData.status}
                onChange={handleInputChange}
                fullWidth
                select
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="maintenance">En maintenance</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annuler</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingRoom ? 'Mettre à jour' : 'Ajouter'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SallesManagement;