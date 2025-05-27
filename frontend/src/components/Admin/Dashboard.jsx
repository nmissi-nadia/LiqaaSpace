import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord Administrateur
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Gestion des Utilisateurs</Typography>
              <Typography variant="body2" paragraph>
                Gérez les comptes utilisateurs, les rôles et les permissions.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/admin/utilisateurs')}
              >
                Accéder
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <MeetingRoomIcon color="secondary" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Gestion des Salles</Typography>
              <Typography variant="body2" paragraph>
                Consultez et gérez toutes les salles de l'entreprise.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/salles')}
              >
                Voir les salles
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <EventAvailableIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h6" gutterBottom>Réservations</Typography>
              <Typography variant="body2" paragraph>
                Visualisez et gérez toutes les réservations.
              </Typography>
              <Button 
                variant="contained" 
                color="success"
                onClick={() => navigate('/reservations')}
              >
                Voir les réservations
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;