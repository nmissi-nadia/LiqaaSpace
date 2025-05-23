import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

const SalleList = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Liste des salles
      </Typography>
      <Button 
        component={Link} 
        to="/salles/nouveau" 
        variant="contained" 
        sx={{ mb: 2 }}
      >
        Ajouter une salle
      </Button>
      {/* La liste des salles sera ajoutée ici */}
    </Box>
  );
};

export default SalleList;