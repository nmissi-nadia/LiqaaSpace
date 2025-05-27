import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Box,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import RoomIcon from '@mui/icons-material/Room';
import EventNoteIcon from '@mui/icons-material/EventNote';

const CollaborateurDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mon Esppace Personnel
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EventAvailableIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Réserver une Salle</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Réservez une salle de réunion pour votre équipe.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/reserver')}
                fullWidth
              >
                Nouvelle réservation
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EventNoteIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6">Mes Réservations</Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Consultez l'historique de vos réservations.
              </Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate('/mes-reservations')}
                fullWidth
              >
                Voir mes réservations
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              Prochaines Réunions
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
              <Box>
                <Typography fontWeight="bold">Réunion d'équipe</Typography>
                <Typography variant="body2" color="text.secondary">Salle A1 - Aujourd'hui à 14:00</Typography>
              </Box>
              <Button 
                variant="text" 
                color="primary"
                onClick={() => navigate('/reunion/123')}
              >
                Détails
              </Button>
            </Box>
            {/* Autres réunions... */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CollaborateurDashboard;