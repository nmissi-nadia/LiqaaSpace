import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  Event as EventIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';


const Home = () => {
  const features = [
    {
      id: 1,
      title: "Voir les salles",
      description: "Parcourez toutes les salles disponibles",
      icon: <RoomIcon color="primary" sx={{ fontSize: 40 }} />,
      path: "/salles"
    },
    {
      id: 2,
      title: "Mes réservations",
      description: "Consultez et gérez vos réservations",
      icon: <EventIcon color="secondary" sx={{ fontSize: 40 }} />,
      path: "/reservations"
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      {
        //donner code de hero section
        
      }
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: '#494738' }}>
            Bienvenue sur LiqaaSpace
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Gérez et réservez facilement vos salles de réunion
          </Typography>
          <Box sx={{ mt: 4, '& > *': { m: 1 } }}>
            <Button
              component={Link}
              to="/salles"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RoomIcon />}
              sx={{ 
                backgroundColor: '#008a8c',
                '&:hover': {
                  backgroundColor: '#00696b'
                }
              }}
            >
              Voir les salles
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<LoginIcon />}
              sx={{ 
                color: '#008a8c',
                borderColor: '#008a8c',
                '&:hover': {
                  borderColor: '#00696b',
                  color: '#00696b'
                }
              }}
            >
              Se connecter
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Section Fonctionnalités */}
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#494738' }}>
          Nos Services
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature) => (
            <Grid item key={feature.id} xs={12} md={6}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                backgroundColor: '#ffffff',
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#494738' }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button 
                    component={Link} 
                    to={feature.path} 
                    color="primary"
                    sx={{ 
                      color: '#008a8c',
                      '&:hover': {
                        color: '#00696b'
                      }
                    }}
                  >
                    En savoir plus
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;