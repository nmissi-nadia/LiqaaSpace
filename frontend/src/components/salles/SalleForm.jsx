import React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper
} from '@mui/material';

const SalleForm = ({ onSubmit, initialValues }) => {
  const [images, setImages] = useState([]);

  const validationSchema = Yup.object({
    nom: Yup.string().required('Le nom est requis'),
    description: Yup.string().required('La description est requise'),
    responsable_id: Yup.number().required('Le responsable est requis'),
    location: Yup.string().required('La localisation est requise'),
    capacite: Yup.number().required('La capacité est requise'),
    status: Yup.string().required('Le statut est requis'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      nom: '',
      description: '',
      responsable_id: '',
      location: '',
      capacite: '',
      status: 'active',
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });
      images.forEach(image => {
        formData.append('images[]', image);
      });
      onSubmit(formData);
    },
  });

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {initialValues ? 'Modifier la salle' : 'Ajouter une salle'}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            name="nom"
            label="Nom"
            value={formik.values.nom}
            onChange={formik.handleChange}
            error={formik.touched.nom && Boolean(formik.errors.nom)}
            helperText={formik.touched.nom && formik.errors.nom}
          />
          <TextField
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
          <TextField
            name="responsable_id"
            label="ID du responsable"
            type="number"
            value={formik.values.responsable_id}
            onChange={formik.handleChange}
            error={formik.touched.responsable_id && Boolean(formik.errors.responsable_id)}
            helperText={formik.touched.responsable_id && formik.errors.responsable_id}
          />
          <TextField
            name="location"
            label="Localisation"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
          />
          <TextField
            name="capacite"
            label="Capacité"
            type="number"
            value={formik.values.capacite}
            onChange={formik.handleChange}
            error={formik.touched.capacite && Boolean(formik.errors.capacite)}
            helperText={formik.touched.capacite && formik.errors.capacite}
          />
          <TextField
            name="status"
            label="Statut"
            select
            SelectProps={{ native: true }}
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </TextField>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            {initialValues ? 'Mettre à jour' : 'Ajouter'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default SalleForm;