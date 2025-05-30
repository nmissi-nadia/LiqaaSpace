import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  MeetingRoom as RoomIcon,
  Chair as ChairIcon,
  Wifi as WifiIcon,
  Tv as TvIcon,
  Videocam as VideocamIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import api from '../../services/api';

const SallesManagement = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 10,
    floor: 'RDC',
    building: 'Bâtiment A',
    equipment: [],
    status: 'available'
  });

  const equipmentOptions = [
    { value: 'projector', label: 'Projecteur', icon: <VideocamIcon /> },
    { value: 'tv', label: 'Écran TV', icon: <TvIcon /> },
    { value: 'phone', label: 'Téléphone', icon: <PhoneIcon /> },
    { value: 'wifi', label: 'Wi-Fi', icon: <WifiIcon /> }
  ];

  const fetchRooms = async () => {
    try {
      const response = await api.get('/api/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des salles:', error);
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
        name: room.name,
        capacity: room.capacity,
        floor: room.floor,
        building: room.building,
        equipment: [...room.equipment],
        status: room.status
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: '',
        capacity: 10,
        floor: 'RDC',
        building: 'Bâtiment A',
        equipment: [],
        status: 'available'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => {
      const equipmentList = [...prev.equipment];
      const index = equipmentList.indexOf(equipment);
      
      if (index === -1) {
        equipmentList.push(equipment);
      } else {
        equipmentList.splice(index, 1);
      }
      
      return { ...prev, equipment: equipmentList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await api.put(`/api/rooms/${editingRoom}`, formData);
      } else {
        await api.post('/api/rooms', formData);
      }
      fetchRooms();
      handleCloseDialog();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la salle:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      try {
        await api.delete(`/api/rooms/${id}`);
        fetchRooms();
      } catch (error) {
        console.error('Erreur lors de la suppression de la salle:', error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/api/rooms/${id}/status`, {
        status: currentStatus === 'available' ? 'maintenance' : 'available'
      });
      fetchRooms();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestion des Salles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Ajouter une salle
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Étage</TableCell>
                <TableCell>Bâtiment</TableCell>
                <TableCell>Capacité</TableCell>
                <TableCell>Équipements</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <ChairIcon fontSize="small" sx={{ mr: 1 }} />
                      {room.capacity}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {room.equipment.map((eq) => {
                        const option = equipmentOptions.find(e => e.value === eq);
                        return option ? (
                          <Tooltip key={eq} title={option.label}>
                            <span>{option.icon}</span>
                          </Tooltip>
                        ) : null;
                      })}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={room.status === 'available' ? 'Disponible' : 'Maintenance'}
                      color={room.status === 'available' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => handleOpenDialog(room)} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={room.status === 'available' ? 'Mettre en maintenance' : 'Rendre disponible'}>
                      <IconButton 
                        onClick={() => handleToggleStatus(room.id, room.status)}
                        size="small"
                        color={room.status === 'available' ? 'warning' : 'success'}
                      >
                        {room.status === 'available' ? <CloseIcon /> : <CheckIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton 
                        onClick={() => handleDeleteRoom(room.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog d'ajout/modification */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingRoom ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'grid', gap: 2 }}>
              <TextField
                name="name"
                label="Nom de la salle"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  name="capacity"
                  label="Capacité"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
                
                <TextField
                  name="floor"
                  label="Étage"
                  select
                  value={formData.floor}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {['RDC', '1er', '2ème', '3ème', '4ème', '5ème'].map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      {floor} étage
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              
              <TextField
                name="building"
                label="Bâtiment"
                value={formData.building}
                onChange={handleInputChange}
                fullWidth
              />
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Équipements
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {equipmentOptions.map((eq) => (
                    <Chip
                      key={eq.value}
                      icon={eq.icon}
                      label={eq.label}
                      onClick={() => handleEquipmentToggle(eq.value)}
                      color={formData.equipment.includes(eq.value) ? 'primary' : 'default'}
                      variant={formData.equipment.includes(eq.value) ? 'filled' : 'outlined'}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
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