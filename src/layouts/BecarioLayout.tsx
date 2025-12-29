import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { BecarioHeader } from '../components/headers';
import { Footer } from '../components/common';

const BecarioLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <BecarioHeader />
      
      {/* Contenido principal */}
      <Box component="main">
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        }>
          <Outlet />
        </Suspense>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default BecarioLayout;