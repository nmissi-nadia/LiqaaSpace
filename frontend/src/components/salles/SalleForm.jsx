import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  Grid
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const SalleForm = ({ onSubmit, initialValues = {}, isEdit = false }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(initialValues.images || []);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est requis').max(255, 'Le nom ne doit pas dépasser 255 caractères'),
    description: Yup.string().required('La description est requise'),
    responsable_id: Yup.number().required('Le responsable est requis').integer('Doit être un nombre entier'),
    location: Yup.string().required('La localisation est requise'),
    capacite: Yup.number()
      .required('La capacité est requise')
      .integer('La capacité doit être un nombre entier')
      .positive('La capacité doit être positive'),
    status: Yup.string()
      .required('Le statut est requis')
      .oneOf(['active', 'inactive'], 'Statut non valide'),
    images: Yup.array()
      .of(
        Yup.mixed()
          .test('fileSize', 'Fichier trop volumineux (max 2MB)', value => 
            !value || (value && value.size <= 2 * 1024 * 1024)
          )
          .test('fileType', 'Type de fichier non supporté', value => 
            !value || (value && ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'].includes(value.type))
          )
      )
  });

  const formik = useFormik({
    initialValues: {
      nom: initialValues.nom || '',
      description: initialValues.description || '',
      responsable_id: initialValues.responsable_id || '',
      location: initialValues.location || '',
      capacite: initialValues.capacite || '',
      status: initialValues.status || 'active',
      images: initialValues.images || [],
      ...initialValues
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const formData = new FormData();
        
        // Ajouter tous les champs sauf les images
        Object.keys(values).forEach(key => {
          if (key !== 'images' && values[key] !== null) {
            formData.append(key, values[key]);
          }
        });

        // Ajouter chaque image
        images.forEach(image => {
          formData.append('images[]', image);
        });

        await onSubmit(formData);
        navigate('/salles');
      } catch (error) {
        console.error('Erreur:', error);
        setFieldError('general', error.response?.data?.message || 'Une erreur est survenue');
      } finally {
        setSubmitting(false);
      }
    }
  });

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imagePreviews.length > 5) {
      formik.setFieldError('images', 'Maximum 5 images autorisées');
      return;
    }

    const newImages = [];
    const newPreviews = [...imagePreviews];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newPreviews.push(reader.result);
          if (newPreviews.length === imagePreviews.length + files.length) {
            setImagePreviews(newPreviews);
          }
        }
      };
      reader.readAsDataURL(file);
      newImages.push(file);
    });

    setImages([...images, ...newImages]);
    formik.setFieldValue('images', [...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    formik.setFieldValue('images', newImages);
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          {isEdit ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
        </Typography>

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
                error={formik.touched.nom && Boolean(formik.errors.nom)}
                helperText={formik.touched.nom && formik.errors.nom}
                margin="normal"
              />

              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />

              <TextField
                fullWidth
                id="responsable_id"
                name="responsable_id"
                label="ID du responsable"
                type="number"
                value={formik.values.responsable_id}
                onChange={formik.handleChange}
                error={formik.touched.responsable_id && Boolean(formik.errors.responsable_id)}
                helperText={formik.touched.responsable_id && formik.errors.responsable_id}
                margin="normal"
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
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                margin="normal"
              />

              <TextField
                fullWidth
                id="capacite"
                name="capacite"
                label="Capacité (nombre de personnes)"
                type="number"
                value={formik.values.capacite}
                onChange={formik.handleChange}
                error={formik.touched.capacite && Boolean(formik.errors.capacite)}
                helperText={formik.touched.capacite && formik.errors.capacite}
                margin="normal"
                InputProps={{ inputProps: { min: 1 } }}
              />

              <FormControl fullWidth margin="normal" error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Statut</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  label="Statut"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>

              <Box sx={{ mt: 2, mb: 2 }}>
                <input
                  accept="image/jpeg, image/png, image/jpg, image/gif"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ mb: 2 }}
                  >
                    Ajouter des images
                  </Button>
                </label>
                <Typography variant="caption" display="block" color="text.secondary">
                  Formats acceptés: JPEG, PNG, JPG, GIF (max 2MB par image)
                </Typography>
                {formik.touched.images && formik.errors.images && (
                  <FormHelperText error>{formik.errors.images}</FormHelperText>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Aperçu des images */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {imagePreviews.map((preview, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
                <img
                  src={preview}
                  alt={`Aperçu ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                />
                <IconButton
                  size="small"
                  onClick={() => removeImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)'
                    }
                  }}
                >
                  ×
                </IconButton>
              </Box>
            ))}
          </Box>

          {formik.errors.general && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {formik.errors.general}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/salles')}
              disabled={formik.isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SalleForm;