import React, { useState, useEffect  } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  EventAvailable as EventAvailableIcon,
  EventNote as EventNoteIcon,
  MeetingRoom as MeetingRoomIcon,
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';


const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8]
  }
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1)
}));

const CollaborateurDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    reunionsAVenir: 0,
    reservationsEffectuees: 0,
    membresEquipe: 0,
    disponibilite: 0,
    totalSalles: 0,
    sallesDisponibles: 0
  });
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [reunionsAVenir, setReunionsAVenir] = useState([]);
  const [sallesDisponibles, setSallesDisponibles] = useState([]);
  // récupérer l'id de l'utilisateur connecté
  const id = user ? user.id : null;
  // récupérer le token
  const token = localStorage.getItem('token');

  // Récupération des données depuis l'API
  useEffect(() => {
    const recupererDonnees = async () => {
      try {
        setChargement(true);
        const token = localStorage.getItem('token');
        
        // Configuration des headers avec le token
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        // Récupération des statistiques
        const statsResponse = await api.get('/api/stats/collaborateur', { headers });
        console.log('Stats:', statsResponse.data);

        // Récupération des réunions à venir
        const reunionsResponse = await api.get(`/api/reservations/avenir/${id}`, { headers });
        console.log('Réunions:', reunionsResponse.data);

        // Récupération des salles disponibles
        const sallesResponse = await api.get('/api/salles/disponibles', { headers });
        console.log('Salles:', sallesResponse.data);

        // Mise à jour des états
        setStats({
          ...statsResponse.data,
          disponibilite: calculerTauxDisponibilite(statsResponse.data)
        });
        setReunionsAVenir(reunionsResponse.data);
        setSallesDisponibles(sallesResponse.data);

      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setErreur('Impossible de charger les données. Veuillez réessayer plus tard.');
        toast.error('Erreur lors du chargement des données');
      } finally {
        setChargement(false);
      }
    };

    if (user) {
      recupererDonnees();
    }
  }, [user]);

  const calculerTauxDisponibilite = (donnees) => {
    const totalSalles = donnees.sallesDisponibles + donnees.sallesOccupees;
    return totalSalles > 0 
      ? Math.round((donnees.sallesDisponibles / totalSalles) * 100) 
      : 0;
  };

  const formaterDate = (chaineDate) => {
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(chaineDate).toLocaleDateString('fr-FR', options);
  };

  const obtenirIconeStatut = (statut) => {
    switch(statut) {
      case 'accepté':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'en attente':
        return <AccessTimeIcon color="warning" fontSize="small" />;
      default:
        return <WarningIcon color="error" fontSize="small" />;
    }
  };

  if (chargement) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (erreur) {
    return (
      <Box textAlign="center" py={4}>
        <WarningIcon color="error" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          Erreur de chargement
        </Typography>
        <Typography color="textSecondary" paragraph>
          {erreur}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Mon Espace Personnel
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<EventAvailableIcon />}
          onClick={() => navigate('/collaborateur/mesreservations')}
        >
          Nouvelle réservation
        </Button>
      </Box>
      
      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <EventNoteIcon />
                </Avatar>
                <Typography variant="h6" color="textSecondary">Mes Réservations</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stats.reservationsEffectuees}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.reservationsEffectuees === 1 ? 'Réservation effectuée' : 'Réservations effectuées'}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h6" color="textSecondary">Équipe</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stats.membresEquipe}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.membresEquipe === 1 ? 'Membre dans votre équipe' : 'Membres dans votre équipe'}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'warning.light', mr: 2 }}>
                  <MeetingRoomIcon />
                </Avatar>
                <Typography variant="h6" color="textSecondary">Disponibilité</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h4" component="div" sx={{ mr: 1 }}>
                  {stats.disponibilite}%
                </Typography>
              </Box>
              <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.disponibilite} 
                  color={stats.disponibilite > 50 ? 'success' : 'warning'}
                  sx={{ height: 8, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {stats.sallesDisponibles} {stats.sallesDisponibles === 1 ? 'salle disponible' : 'salles disponibles'}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <CalendarTodayIcon />
                </Avatar>
                <Typography variant="h6" color="textSecondary">Salles</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {stats.totalSalles}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stats.totalSalles === 1 ? 'Salle au total' : 'Salles au total'}
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        {/* Prochaines réunions */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h2">
                  Mes prochaines réunions
                </Typography>
                <Button 
                  color="primary" 
                  size="small"
                  onClick={() => navigate('/collaborateur/mesreservations')}
                  endIcon={<EventNoteIcon />}
                >
                  Voir tout
                </Button>
              </Box>
              
              {reunionsAVenir.length > 0 ? (
                <Box>
                  {reunionsAVenir.map((reunion) => (
                    <Box key={reunion.id}>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        p={2}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            borderRadius: 1,
                            cursor: 'pointer' 
                          } 
                        }}
                        onClick={() => navigate(`/collaborateur/reunion/${reunion.id}`)}
                      >
                        <Box>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            {obtenirIconeStatut(reunion.statut)}
                            <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'medium' }}>
                              {reunion.titre}
                            </Typography>
                          </Box>
                          <Box display="flex" flexWrap="wrap" alignItems="center">
                            <StyledChip 
                              icon={<MeetingRoomIcon fontSize="small" />} 
                              label={reunion.salle.nom} 
                              size="small" 
                              variant="outlined"
                            />
                            <Typography variant="body2" color="textSecondary">
                              {formaterDate(reunion.date_debut)}
                            </Typography>
                          </Box>
                        </Box>
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="primary"
                        >
                          Détails
                        </Button>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <EventNoteIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    Aucune réunion à venir
                  </Typography>
                  <Button 
                    variant="text" 
                    color="primary"
                    onClick={() => navigate('/collaborateur/mesreservations')}
                    sx={{ mt: 2 }}
                  >
                    Réserver une salle
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Salles disponibles */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h2">
                  Salles disponibles
                </Typography>
                <Button 
                  color="primary" 
                  size="small"
                  onClick={() => navigate('/collaborateur/sallesdisponibles')}
                  endIcon={<MeetingRoomIcon />}
                >
                  Voir tout
                </Button>
              </Box>
              
              {sallesDisponibles.length > 0 ? (
                <Box>
                  {sallesDisponibles.map((salle) => (
                    <Box 
                      key={salle.id} 
                      display="flex" 
                      justifyContent="space-between" 
                      alignItems="center"
                      p={2}
                      mb={1}
                      sx={{ 
                        bgcolor: salle.disponible ? 'success.lighter' : 'grey.100',
                        borderRadius: 1,
                        borderLeft: `4px solid ${salle.disponible ? 'success.main' : 'grey.500'}`
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {salle.nom}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Capacité: {salle.capacite} personnes
                        </Typography>
                      </Box>
                      <Chip 
                        label={salle.disponible ? 'Disponible' : 'Occupée'} 
                        color={salle.disponible ? 'success' : 'default'}
                        size="small"
                        variant={salle.disponible ? 'filled' : 'outlined'}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box textAlign="center" py={4}>
                  <MeetingRoomIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" color="textSecondary">
                    Aucune salle disponible pour le moment
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Actions rapides */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Actions rapides
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<EventAvailableIcon />}
                  onClick={() => navigate('/collaborateur/mesreservations')}
                >
                  Nouvelle réservation
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  startIcon={<EventNoteIcon />}
                  onClick={() => navigate('/collaborateur/mesreservations')}
                >
                  Voir mes réservations
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  fullWidth
                  startIcon={<MeetingRoomIcon />}
                  onClick={() => navigate('/collaborateur/sallesdisponibles')}
                >
                  Explorer les salles
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CollaborateurDashboard;