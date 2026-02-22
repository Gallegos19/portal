import React from 'react';
import { Box, Card, Typography, Chip, Avatar } from '@mui/material';
import { Layers as LayersIcon, Public as PublicIcon } from '@mui/icons-material';
import type { Subproject } from '../../../types/api';

interface SubprojectosDetailPanelProps {
  subproject: Subproject | null;
  getStatusLabel: (statusId?: string) => string;
  getStatusColor: (statusId?: string) => string;
  regionMap: Map<string, string>;
}

const SubprojectosDetailPanel: React.FC<SubprojectosDetailPanelProps> = ({
  subproject,
  getStatusLabel,
  getStatusColor,
  regionMap,
}) => {
  if (!subproject) {
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
          <LayersIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Selecciona un subproyecto para ver detalles
          </Typography>
        </Box>
      </Card>
    );
  }

  const statusColor = getStatusColor(subproject.status_id);

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
          <LayersIcon />
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
            {subproject.name_subproject}
          </Typography>
          <Chip
            label={getStatusLabel(subproject.status_id)}
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
        {/* Región */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PublicIcon sx={{ fontSize: 18, color: '#26C6DA' }} />
            <Typography
              variant="overline"
              sx={{
                color: '#1e293b',
                fontWeight: 700,
                letterSpacing: '0.05em',
                fontSize: '11px',
              }}
            >
              Región
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: '#1e293b',
              ml: 3.5,
            }}
          >
            {regionMap.get(subproject.id_region ?? subproject.region_id ?? '') ?? 'Sin región'}
          </Typography>
        </Box>

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
            ID del Subproyecto
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
            {subproject.id}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default SubprojectosDetailPanel;
