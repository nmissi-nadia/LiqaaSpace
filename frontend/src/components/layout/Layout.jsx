import { Outlet, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

const Layout = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: '#aeac9a' 
    }}>
      {/* En-tête */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1,
            color: '#aeac9a' 
          }}>
            LiqaaSpace
          </Typography>
          <Button 
            color="inherit" 
            component={Link} 
            to="/salles"
            sx={{ 
              color: '#aeac9a',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Salles
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/login"
            sx={{ 
              color: '#aeac9a',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Connexion
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container component="main" sx={{ 
        flexGrow: 1, 
        py: 4,
        backgroundColor: '#ffffff',
        my: 2,
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Outlet />
      </Container>

      {/* Pied de page */}
      <Box component="footer" sx={{ 
        py: 3, 
        backgroundColor: '#494738',
        color: '#aeac9a',
        mt: 'auto'
      }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} LiqaaSpace - Tous droits réservés
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;