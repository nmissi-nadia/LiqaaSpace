import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  MeetingRoom as RoomIcon,
  Event as EventIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

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
  const stats = [
    { title: 'Utilisateurs', value: '156', icon: PeopleIcon, color: 'primary' },
    { title: 'Salles', value: '24', icon: RoomIcon, color: 'secondary' },
    { title: 'Réservations', value: '89', icon: EventIcon, color: 'success' },
    { title: 'Taux occupation', value: '78%', icon: StatsIcon, color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Tableau de bord</Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
        
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