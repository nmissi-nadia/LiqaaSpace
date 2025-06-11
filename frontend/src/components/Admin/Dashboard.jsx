import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  MeetingRoom as MeetingRoomIcon,
  Event as EventIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import api from '../../services/api';

const StatCard = ({ title, value, icon: Icon, color = 'primary' }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        bgcolor: `${color}.light`, 
        color: `${color}.contrastText`, 
        p: 2, 
        borderRadius: 1,
        mr: 2
      }}>
        <Icon fontSize="large" />
      </Box>
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="textSecondary">{title}</Typography>
      </Box>
    </Paper>
  </Grid>
);

const AdminDashboard = () => {
      const [stats, setStats] = useState({
        totalUsers: 0,
        totalRooms: 0,
        totalReservations: 0,
        totalRevenue: 0
      });

      const [reservationsData, setReservationsData] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchStats = async () => {
          try {
            // Récupérer les statistiques générales
            const statsResponse = await api.get('api/stats');
            setStats(statsResponse.data);

            // Récupérer les données pour le graphique
            const reservationsResponse = await api.get('api/reservations/stats');
            setReservationsData(reservationsResponse.data);
          } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
          } finally {
            setLoading(false);
          }
        };

        fetchStats();
      }, []);

      if (loading) {
        return <Typography variant="h6">Chargement des statistiques...</Typography>;
      }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tableau de bord</Typography>
      <Grid container spacing={3}>
      <StatCard 
          title="Utilisateurs"
          value={stats.totalUsers}
          icon={PeopleIcon}
          color="primary"
        />
        <StatCard 
          title="Salles"
          value={stats.totalRooms}
          icon={MeetingRoomIcon}
          color="secondary"
        />
        <StatCard 
          title="Réservations"
          value={stats.totalReservations}
          icon={EventIcon}
          color="success"
        />
        <StatCard 
          title="Revenu"
          value={`${stats.totalRevenue} €`}
          icon={StatsIcon}
          color="warning"
        />
        
        {/* Dernières réservations */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Dernières réservations</Typography>
            {/* Ici vous pouvez ajouter un composant de tableau ou de liste */}

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Ici vous pouvez ajouter des lignes de données */}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;