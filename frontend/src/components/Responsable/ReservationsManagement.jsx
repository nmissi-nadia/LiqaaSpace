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
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Grid,
  Divider,
  Avatar,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Event as EventIcon,
  Person as PersonIcon,
  MeetingRoom as RoomIcon,
  AccessTime as TimeIcon,
  EventAvailable as AvailableIcon,
  EventBusy as BusyIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../../services/api';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
};

const statusIcons = {
  pending: <PendingIcon />,
  approved: <AvailableIcon />,
  rejected: <BusyIcon />
};

const ReservationsManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/api/reservations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/reservations/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchReservations();
      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, status });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReservation(null);
  };

  const filteredReservations = reservations
    .filter(reservation => 
      (reservation.salle?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       reservation.collaborateur?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || reservation.status === statusFilter)
    )
    .sort((a, b) => new Date(b.date + ' ' + b.heure_debut) - new Date(a.date + ' ' + a.heure_fin));

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'PPPp', { locale: fr });
  };

  const getTimeRange = (start, end) => {
    return `${format(parseISO(start), 'HH:mm')} - ${format(parseISO(end), 'HH:mm')}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Gestion des Réservations
        </Typography>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center">
              <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par salle ou demandeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filtrer par statut"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">Tous les statuts</MenuItem>
              <MenuItem value="en attente">En attente</MenuItem>
              <MenuItem value="approuvee">Approuvées</MenuItem>
              <MenuItem value="rejetee">Rejetées</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                onClick={() => {/* Ajouter une fonction pour afficher le calendrier */}}
              >
                Voir le calendrier
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Salle</TableCell>
              <TableCell>Demandeur</TableCell>
              <TableCell>Date et heure</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell align="center">Statut</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow key={reservation.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <RoomIcon color="action" sx={{ mr: 1 }} />
                    {reservation.salle?.nom}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      src={reservation.collaborateur?.avatar} 
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {reservation.collaborateur?.name?.charAt(0)}
                    </Avatar>
                    {reservation.collaborateur?.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <div>{formatDate(reservation.date)}</div>
                      <div style={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {getTimeRange(reservation.heure_debut, reservation.heure_fin)}
                      </div>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={reservation.purpose} arrow>
                    <Box sx={{ 
                      maxWidth: 200, 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}>
                      {reservation.purpose}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    icon={statusIcons[reservation.status]}
                    label={reservation.status === 'en attente' ? 'En attente' : 
                           reservation.status === 'approuvee' ? 'Approuvée' : 'Rejetée'}
                    color={statusColors[reservation.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Voir les détails" arrow>
                    <IconButton onClick={() => handleOpenDialog(reservation)}>
                      <ViewIcon color="info" />
                    </IconButton>
                  </Tooltip>
                  {reservation.status === 'en attente' && (
                    <>
                      <Tooltip title="Approuver" arrow>
                        <IconButton 
                          onClick={() => handleStatusUpdate(reservation.id, 'approuvee')}
                        >
                          <ApproveIcon color="success" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rejeter" arrow>
                        <IconButton 
                          onClick={() => handleStatusUpdate(reservation.id, 'rejetee')}
                        >
                          <RejectIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Détails de la réservation */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
      >
        {selectedReservation && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center">
                <EventIcon color="primary" sx={{ mr: 1 }} />
                Détails de la réservation
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Salle
                  </Typography>
                  <Typography variant="body1">
                    {selectedReservation.room?.nom} (Capacité: {selectedReservation.room?.capacite})
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Demandeur
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Avatar 
                      src={selectedReservation.user?.avatar} 
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {selectedReservation.user?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1">
                        {selectedReservation.user?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedReservation.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedReservation.date)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Horaire
                  </Typography>
                  <Typography variant="body1">
                    {getTimeRange(selectedReservation.heure_debut, selectedReservation.heure_fin)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Motif
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedReservation.purpose}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Statut
                  </Typography>
                  <Box>
                    <Chip
                      icon={statusIcons[selectedReservation.status]}
                      label={selectedReservation.status === 'active' ? 'En attente' : 
                             selectedReservation.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      color={statusColors[selectedReservation.status]}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>

                {selectedReservation.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedReservation.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedReservation.status === 'en attente' && (
                <>
                  <Button
                    startIcon={<ApproveIcon />}
                    onClick={() => {
                      handleStatusUpdate(selectedReservation.id, 'approved');
                      handleCloseDialog();
                    }}
                    color="success"
                  >
                    Approuver
                  </Button>
                  <Button
                    startIcon={<RejectIcon />}
                    onClick={() => {
                      handleStatusUpdate(selectedReservation.id, 'rejected');
                      handleCloseDialog();
                    }}
                    color="error"
                  >
                    Rejeter
                  </Button>
                </>
              )}
              <Button onClick={handleCloseDialog} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ReservationsManagement;