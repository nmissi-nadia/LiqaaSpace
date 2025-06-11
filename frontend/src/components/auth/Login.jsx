import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button, Link, Alert } from '@mui/material';
import api from '../../services/api';

const validationSchema = Yup.object({
  email: Yup.string().email('Email invalide').required('Champ requis'),
  password: Yup.string().required('Champ requis'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const success = await login(values.email, values.password);
        console.log('Token after login:', localStorage.getItem('access_token'));
        if (success) {
          // Récupérer le rôle de l'utilisateur
          const userResponse = await api.get('api/user');  
          const role = userResponse.data.role;
          
          // Redirection selon le rôle
          switch(role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'responsable':
              navigate('/responsable/dashboard');
              break;
            case 'collaborateur':
              navigate('/collaborateur'); 
              break;
            default:
              navigate('/');
              break;
          }
        } else {
          throw new Error('Échec de la connexion');
        }
      } catch (error) {
        console.error('Erreur de connexion:', error);
        
        if (error.response?.data?.errors) {
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            setFieldError(field, messages[0]);
          });
        } else {
          const errorMessage = error.response?.data?.message 
            ? error.response.data.message
            : 'Impossible de se connecter. Vérifiez votre email et mot de passe.';
          
          // Afficher l'erreur dans un composant Alert
          alert(errorMessage);
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
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2, mb: 2 }}
        disabled={formik.isSubmitting}
        color="primary"
      >
        Se connecter
      </Button>
      <Link href="/auth/register" variant="body2" color="primary">
        Créer un compte
      </Link>
    </Box>
  );
};

export default LoginForm;