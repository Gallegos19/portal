import React from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import type { Region } from '../../../types/api';

interface FacilitadoresFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  regions: Region[];
  totalCount: number;
}

const FacilitadoresFilters: React.FC<FacilitadoresFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  regionFilter,
  onRegionFilterChange,
  regions,
  totalCount
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lista de facilitadores
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} resultados
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 280 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            label="Estado"
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activo">Activos</MenuItem>
            <MenuItem value="inactivo">Inactivos</MenuItem>
            <MenuItem value="eliminado">Eliminados</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={regionFilter}
            label="Region"
            onChange={(event) => onRegionFilterChange(event.target.value)}
          >
            <MenuItem value="todos">Todas</MenuItem>
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name_region ?? region.name ?? 'Sin nombre'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default FacilitadoresFilters;
