import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../../services/api';

const SalleForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  console.log('SalleForm - Initial render', { initialValues, isEdit });
  
  const [imagePreviews, setImagePreviews] = useState(initialValues.images || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  console.log('SalleForm - User context:', { user });

  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est requis'),
    description: Yup.string().required('La description est requise'),
    location: Yup.string().required('La localisation est requise'),
    capacite: Yup.number()
      .required('La capacité est requise')
      .positive('La capacité doit être positive')
      .integer('La capacité doit être un nombre entier'),
    status: Yup.string()
      .required('Le statut est requis')
      .oneOf(['active', 'inactive'], 'Statut non valide'),
    images: Yup.array()
      .max(5, 'Maximum 5 images autorisées')
  });

  const formik = useFormik({
    initialValues: {
      nom: initialValues.nom || '',
      description: initialValues.description || '',
      location: initialValues.location || '',
      capacite: initialValues.capacite || '',
      status: initialValues.status || 'active',
      images: initialValues.images || [],
      responsable_id: user?.id || '',
      ...initialValues
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      console.log('Form submission started', { values });
      
      try {
        setLoading(true);
        const formData = new FormData();
        
        console.log('Processing form values:', values);
        
        // Add all fields except images
        Object.keys(values).forEach(key => {
          if (key !== 'images' && values[key] !== null) {
            console.log(`Appending field: ${key} =`, values[key]);
            formData.append(key, values[key]);
          }
        });
        
        // Add responsable_id from the current user
        if (user?.id) {
          console.log('Ajout du responsable_id de user:', user.id);
          formData.append('responsable_id', user.id);
        } else {
          console.warn('No user ID found in context');
        }
         // Add images
        // Ajouter les images correctement
        if (values.images && values.images.length > 0) {
          values.images.forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`images[]`, image);  // Notez le `images[]` pour un tableau
            }
          });
        } else {
          formData.append('images', '[]');  // Tableau vide encodé en JSON
        }

        // Pour le débogage, affichez le contenu de FormData
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ', pair[1]);
        }

        const url = isEdit ? `/salles/${id}` : '/salles';
        const method = isEdit ? 'put' : 'post';
        
        console.log(`Sending ${method.toUpperCase()} request to:`, url);

        const response = await api({
          method,
          url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        });

        console.log('Server response:', response.data);
        
        alert(`Salle ${isEdit ? 'mise à jour' : 'créée'} avec succès`);
        navigate('/salles');
        
      } catch (error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          responseData: error.response?.data,
          request: error.request,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            data: error.config?.data
          }
        });
        
        if (error.response?.data?.errors) {
          console.log('Validation errors:', error.response.data.errors);
          const { errors } = error.response.data;
          Object.keys(errors).forEach(field => {
            console.log(`Setting error for field ${field}:`, errors[field][0]);
            setFieldError(field, errors[field][0]);
          });
        } else if (error.response?.data?.message) {
          console.log('Server error message:', error.response.data.message);
          setError(error.response.data.message);
        } else {
          console.log('Unexpected error format:', error);
          setError('Une erreur inattendue est survenue');
        }
      } finally {
        console.log('Form submission completed');
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [...formik.values.images || []];
    const newPreviews = [...imagePreviews];
  
    files.forEach(file => {
      if (file.type.match('image.*')) {
        newImages.push(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          setImagePreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
      }
    });
  
    formik.setFieldValue('images', newImages);
  };
  
  const handleDeleteImage = (index) => {
    console.log('Delete image:', index);
    const newImages = [...formik.values.images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    formik.setFieldValue('images', newImages);
    setImagePreviews(newPreviews);
    console.log('Updated form values 1:', formik.values);
  };
  
  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isEdit ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
        </Typography>

        {error && (
          <Box sx={{ mb: 3, color: 'error.main' }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="nom"
                name="nom"
                label="Nom de la salle"
                value={formik.values.nom}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="capacite"
                name="capacite"
                label="Capacité"
                type="number"
                value={formik.values.capacite}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capacite && Boolean(formik.errors.capacite)}
                helperText={formik.touched.capacite && formik.errors.capacite}
                disabled={loading}
                inputProps={{ min: 1, step: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Localisation"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Statut</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                  label="Statut"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Images (max 5)
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload"
                type="file"
                multiple
                onChange={handleImageChange}
                disabled={loading || formik.values.images?.length >= 5}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  color="primary"
                  component="span"
                  startIcon={<PhotoCamera />}
                  disabled={loading || formik.values.images?.length >= 5}
                >
                  Ajouter des images
                </Button>
              </label>
              {formik.touched.images && formik.errors.images && (
                <FormHelperText error>{formik.errors.images}</FormHelperText>
              )}
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteImage(index)}
                      disabled={loading}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'error.dark',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/salles')}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading || formik.isSubmitting}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SalleForm;
