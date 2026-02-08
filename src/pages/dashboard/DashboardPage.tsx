import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useAuthStore } from '../../store/authStore';
import { USER_ROLES } from '../../utils/constants';
import BecarioDashboard from './BecarioDashboard';
import AdminDashboard from './AdminDashboard';
import FacilitadorDashboard from './FacilitadorDashboard';
import LoadingScreen from '../../components/common/LoadingScreen';

const DashboardPage: React.FC = () => {
  const { user, userRole } = useAuthStore();

  if (!user || !userRole) {
    return <LoadingScreen message="Cargando panel de control..." />;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case USER_ROLES.BECARIO:
        return <BecarioDashboard />;
      case USER_ROLES.ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.FACILITADOR:
        return <FacilitadorDashboard />;
      default:
        return (
          <Container>
            <Typography>Rol no reconocido</Typography>
          </Container>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {renderDashboard()}
    </Box>
  );
};

export default DashboardPage;