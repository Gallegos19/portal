import React from 'react';
import { Box, TextField, MenuItem, Typography, Card } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { Region } from '../../../types/api';

interface SubprojectosFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  regiones: Region[];
  resultCount: number;
}

const SubprojectosFilters: React.FC<SubprojectosFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  regiones,
  resultCount,
}) => {
  return (
    <Card
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          label="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: '#94a3b8' }} />,
          }}
          sx={{
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
            },
          }}
          size="small"
          placeholder="Buscar subproyecto..."
        />
        <TextField
          label="Región"
          value={regionFilter}
          onChange={(e) => onRegionFilterChange(e.target.value)}
          select
          sx={{ minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          size="small"
        >
          <MenuItem value="">Todas las regiones</MenuItem>
          {regiones.map((region) => (
            <MenuItem key={region.id} value={region.id}>
              {region.name_region ?? region.name ?? 'Sin nombre'}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Estado"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          select
          sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
          size="small"
        >
          <MenuItem value="">Todos los estados</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="inactivo">Inactivo</MenuItem>
          <MenuItem value="eliminado">Eliminado</MenuItem>
        </TextField>
        <Box sx={{ ml: 'auto' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {resultCount} subproyecto{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default SubprojectosFilters;
