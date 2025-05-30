import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper, 
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  MeetingRoom as RoomIcon,
  EventAvailable as AvailableIcon,
  EventBusy as UnavailableIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const data = api.get("/reservations").then(res => res.data);

const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={2} 
    sx={{ 
      p: 3, 
      height: '100%',
      borderLeft: `4px solid ${color}`,
      borderRadius: 1,
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography color="textSecondary" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}20`,
          borderRadius: '50%',
          width: 56,
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
        }}
      >
        {icon}
      </Box>
    </Box>
  </Paper>
);

const ResponsableDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Tableau de bord
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Salles disponibles"
            value="15"
            icon={<RoomIcon fontSize="large" />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Réservations"
            value="24"
            icon={<AvailableIcon fontSize="large" />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Salles occupées"
            value="8"
            icon={<UnavailableIcon fontSize="large" />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs actifs"
            value="42"
            icon={<PeopleIcon fontSize="large" />}
            color={theme.palette.info.main}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Activité des réservations
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="réservations" fill={theme.palette.primary.main} name="Réservations" />
                  <Bar dataKey="salles" fill={theme.palette.secondary.main} name="Salles utilisées" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Prochaines réservations
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3].map((item) => (
                <Box 
                  key={item} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 1,
                    borderLeft: `3px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Typography variant="subtitle2">Réunion d'équipe</Typography>
                  <Typography variant="body2" color="textSecondary">Salle A1 • 14:00 - 15:30</Typography>
                  <Typography variant="body2" color="textSecondary">Jean Dupont</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResponsableDashboard;