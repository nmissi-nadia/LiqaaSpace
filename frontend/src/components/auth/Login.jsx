// LoginForm.jsx
import React from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Email invalide').required('Champ requis'),
  password: Yup.string().required('Champ requis'),
});

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Login values:', values);
      // Ici, vous ajouterez la logique de connexion
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        id="email"
        name="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        margin="normal"
      />
      <TextField
        fullWidth
        id="password"
        name="password"
        label="Mot de passe"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        margin="normal"
      />
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link href="#" variant="body2" color="primary">
          Mot de passe oublié ?
        </Link>
      </Box>
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        sx={{ 
          mt: 2,
          py: 1.5,
          backgroundColor: '#008a8c',
          '&:hover': {
            backgroundColor: '#00696b',
          }
        }}
      >
        Se connecter
      </Button>
    </Box>
  );
};

export default LoginForm;