import React from 'react';
import { Box, Card, Typography, Chip, Avatar } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import type { Region } from '../../../types/api';

interface RegionesDetailPanelProps {
  region: Region | null;
  getStatusLabel: (statusId?: string) => string;
  getStatusColor: (statusId?: string) => string;
}

const RegionesDetailPanel: React.FC<RegionesDetailPanelProps> = ({ region, getStatusLabel, getStatusColor }) => {
  if (!region) {
    return (
      <Card
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 400,
          bgcolor: '#f8f9fa',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <LocationOn sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Selecciona una región para ver detalles
          </Typography>
        </Box>
      </Card>
    );
  }

  const statusColor = getStatusColor(region.status_id);

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Header Gradient */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${statusColor === '#3b82f6' ? '#3b82f6' : statusColor === '#ef4444' ? '#ef4444' : '#26C6DA'} 0%, ${statusColor === '#3b82f6' ? '#1e40af' : statusColor === '#ef4444' ? '#dc2626' : '#00BCD4'} 100%)`,
          p: 3,
          color: 'white',
          display: 'flex',
          gap: 3,
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.3)',
            color: 'white',
            width: 56,
            height: 56,
            flexShrink: 0,
          }}
        >
          <LocationOn />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            }}
          >
            {region.name_region ?? region.name ?? 'Sin nombre'}
          </Typography>
          <Chip
            label={getStatusLabel(region.status_id)}
            size="small"
            sx={{
              bgcolor: 'rgba(255,255,255,0.3)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-label': {
                px: 1.5,
              },
            }}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* ID */}
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: '#1e293b',
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontSize: '11px',
              display: 'block',
              mb: 1,
            }}
          >
            ID de la Región
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              fontSize: '12px',
              bgcolor: '#f1f5f9',
              p: 1.5,
              borderRadius: 1,
              display: 'block',
              wordBreak: 'break-all',
              color: '#475569',
              fontWeight: 500,
            }}
          >
            {region.id}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default RegionesDetailPanel;
