import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import GroupIcon from '@mui/icons-material/Group';

const ResponsableDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord Responsable
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EventNoteIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Mes Réservations</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Consultez et gérez vos réservations de salles.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/mes-reservations')}
                fullWidth
              >
                Voir mes réservations
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <RoomPreferencesIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Salles Gérées</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Gérez les salles dont vous êtes responsable.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/mes-salles')}
                fullWidth
              >
                Voir mes salles
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <GroupIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Équipe</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Gérez les membres de votre équipe et leurs accès.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary"
                onClick={() => navigate('/mon-equipe')}
              >
                Gérer l'équipe
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResponsableDashboard;