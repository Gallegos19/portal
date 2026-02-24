import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Training } from '../../../types/api';

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 12,
  '& .stat-value': {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: theme.spacing(0.5),
  },
  '& .stat-label': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
}));

interface CapacitacionesStatsProps {
  trainings: Training[];
}

const CapacitacionesStats: React.FC<CapacitacionesStatsProps> = ({ trainings }) => {
  const total = trainings.length;
  const becarios = trainings.filter((training) => training.target_audience === 'Becario').length;
  const facilitadores = trainings.filter((training) => training.target_audience === 'Facilitador').length;

  return (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} md={4}>
        <StatCard elevation={0}>
          <Typography variant="h4" className="stat-value" color="primary">
            {total}
          </Typography>
          <Typography variant="body1" className="stat-label">
            Capacitaciones Totales
          </Typography>
        </StatCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <StatCard elevation={0}>
          <Typography variant="h4" className="stat-value" color="success.main">
            {becarios}
          </Typography>
          <Typography variant="body1" className="stat-label">
            Para Becarios
          </Typography>
        </StatCard>
      </Grid>

      <Grid item xs={12} md={4}>
        <StatCard elevation={0}>
          <Typography variant="h4" className="stat-value" color="warning.main">
            {facilitadores}
          </Typography>
          <Typography variant="body1" className="stat-label">
            Para Facilitadores
          </Typography>
        </StatCard>
      </Grid>
    </Grid>
  );
};

export default CapacitacionesStats;