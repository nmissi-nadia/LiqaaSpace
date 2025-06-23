import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Room as RoomIcon, 
  EventAvailable as AvailableIcon,
  EventBusy as UnavailableIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Star as StarIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../../services/api';

const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={2}
    sx={{ 
      p: 3, 
      height: '100%',
      borderRadius: 2,
      borderLeft: `4px solid ${color}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 3
      }
    }}
  >
    <Box display="flex" alignItems="center" gap={2}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState(null);
  const [topRooms, setTopRooms] = useState([]);
  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, roomsRes, reservationsRes] = await Promise.all([
          api.get('api/stats/responsable', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          api.get('api/salles/top5', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }),
          api.get('api/reservations/prochaine', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        
        setStats(statsRes.data);
        setTopRooms(roomsRes.data);
        setUpcomingReservations(reservationsRes.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Échec du chargement des données du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} color="error.main">
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Statistiques principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Salles disponibles"
            value={stats?.totalSallesdispo || 0}
            icon={<RoomIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value={stats?.totalReservations || 0}
            icon={<AvailableIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Salles occupées"
            value={stats?.totalSallesoccupe || 0}
            icon={<UnavailableIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs actifs"
            value={stats?.totalCollaborateurs || 0}
            icon={<PeopleIcon fontSize="large" />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top 5 des salles les plus réservées */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <StarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Salles les plus réservées
              </Typography>
            </Box>
            <List>
              {topRooms.map((room, index) => (
                <React.Fragment key={room.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        <RoomIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={room.nom}
                      secondary={`${room.reservations_count} réservations`}
                    />
                    <Chip 
                      label={`#${index + 1}`} 
                      color="primary" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                  {index < topRooms.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Prochaines réservations */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Prochaines réservations
              </Typography>
            </Box>
            <List>
              {upcomingReservations.map((reservation) => (
                <React.Fragment key={reservation.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.success.light }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={reservation.salle?.nom}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            {format(new Date(reservation.date_debut), 'PPPp', { locale: fr })}
                          </Typography>
                          <Typography component="span" variant="body2" color="textSecondary">
                            {reservation.utilisateur?.name}
                          </Typography>
                        </>
                      }
                    />
                    <Chip 
                      label={reservation.statut} 
                      color={
                        reservation.statut === 'accepté' ? 'success' : 
                        reservation.statut === 'en attente' ? 'warning' : 'error'
                      } 
                      size="small"
                    />
                  </ListItem>
                  {reservation !== upcomingReservations[upcomingReservations.length - 1] && 
                    <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;