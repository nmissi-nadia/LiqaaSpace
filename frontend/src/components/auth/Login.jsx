import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, Link } from '@mui/material';
import api from '../../services/api';


const validationSchema = Yup.object({
  email: Yup.string().email('Email invalide').required('Champ requis'),
  password: Yup.string().required('Champ requis'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const showMessage = (message, type = 'info') => {
    console.log(`${type}: ${message}`);

  };
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const success = await login(values.email, values.password);
        console.log('Connexion réussie:', success);
        
        if (success) {
          
          const connecte = await api.get('/users');
          console.log(connecte.data.role);
      
      switch(connecte.data.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'responsable':
          navigate('/responsable/dashboard');
          break;
        case 'collaborateur':
          navigate('/collaborateur/dashboard'); 
        } 
        showMessage('Connexion réussie !', 'success'); 
        } else {
          throw new Error('Échec de la connexion');
        }
      } catch (error) {
        console.error('Erreur complète:', {
          error,
          response: error.response,
          request: error.request,
          config: error.config
        });
        
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            setFieldError(field, messages[0]);
          });
        } else {
          const errorMessage = error.response?.data?.message 
            ? `Erreur serveur: ${error.response.data.message}`
            : 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
          
          showMessage(errorMessage, 'error');
        }
      } finally {
        setSubmitting(false);
      }
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