import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Button, Grid, Fade, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import LoginForm from './Login';
import RegisterForm from './Register';
import Layout from '../layout/Layout';
import meetingImage from '../../assets/images/salle.jpg'; 

const AuthContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  borderRadius: '15px',
  overflow: 'hidden',
  boxShadow: theme.shadows[10],
  maxWidth: 1000,
  margin: '2rem auto',
}));

const ImageSection = styled(Box)({
  flex: 1,
  backgroundImage: `url(${meetingImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '600px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 138, 140, 0.7)',
  },
});

const FormSection = styled(Box)({
  flex: 1,
  padding: '3rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const ToggleButton = styled(Button)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  zIndex: 1,
});

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
     
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="lg">
        <AuthContainer>
          <ImageSection>
            <Box sx={{ 
              position: 'relative', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              p: 4,
              color: 'white',
              zIndex: 1 
            }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                {isLogin ? 'Content de vous revoir !' : 'Rejoignez-nous'}
              </Typography>
              <Typography variant="h6">
                {isLogin 
                  ? 'Connectez-vous pour accéder à votre espace personnel' 
                  : 'Créez un compte pour réserver des salles de réunion'}
              </Typography>
            </Box>
          </ImageSection>

          <FormSection>
            <ToggleButton 
              onClick={toggleForm}
              color="primary"
              variant="outlined"
              sx={{ 
                alignSelf: 'flex-end',
                color: '#008a8c',
                borderColor: '#008a8c',
                '&:hover': {
                  borderColor: '#00696b',
                  backgroundColor: 'rgba(0, 138, 140, 0.1)'
                }
              }}
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </ToggleButton>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" component="h1" color="primary">
                {isLogin ? 'Connexion' : 'Inscription'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLogin ? 'Entrez vos identifiants pour vous connecter' : 'Créez votre compte en quelques secondes'}
              </Typography>
            </Box>

            <Fade in={isLogin} timeout={500}>
              <div style={{ display: isLogin ? 'block' : 'none' }}>
                <LoginForm />
              </div>
            </Fade>

            <Fade in={!isLogin} timeout={500}>
              <div style={{ display: !isLogin ? 'block' : 'none' }}>
                <RegisterForm onSuccess={toggleForm} />
              </div>
            </Fade>
          </FormSection>
        </AuthContainer>
      </Container>
    </Box>
   
    
  );
};

export default AuthPage;