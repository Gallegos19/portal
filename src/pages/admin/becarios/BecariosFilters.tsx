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
import type { Region, SocialFacilitator, Subproject } from '../../../types/api';

interface BecariosFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  facilitatorFilter: string;
  onFacilitatorFilterChange: (value: string) => void;
  regionFilter: string;
  onRegionFilterChange: (value: string) => void;
  subprojectFilter: string;
  onSubprojectFilterChange: (value: string) => void;
  facilitators: SocialFacilitator[];
  facilitatorMap: Map<string, string>;
  regions: Region[];
  subprojects: Subproject[];
  totalCount: number;
  showFacilitatorFilter?: boolean;
  showRegionFilter?: boolean;
}

const BecariosFilters: React.FC<BecariosFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  facilitatorFilter,
  onFacilitatorFilterChange,
  regionFilter,
  onRegionFilterChange,
  subprojectFilter,
  onSubprojectFilterChange,
  facilitators,
  facilitatorMap,
  regions,
  subprojects,
  totalCount,
  showFacilitatorFilter = true,
  showRegionFilter = true
}) => {
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Lista de becarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} resultados
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Buscar por nombre, correo o CHID..."
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
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            label="Estado"
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activo">Activos</MenuItem>
            <MenuItem value="inactivo">Inactivos</MenuItem>
          </Select>
        </FormControl>

        {showFacilitatorFilter && (
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Facilitador</InputLabel>
            <Select
              value={facilitatorFilter}
              label="Facilitador"
              onChange={(event) => onFacilitatorFilterChange(event.target.value)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              {facilitators.map((facilitator) => (
                <MenuItem key={facilitator.id} value={facilitator.id}>
                  {facilitatorMap.get(facilitator.id) ?? 'Sin nombre'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {showRegionFilter && (
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
        )}

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Subproyecto</InputLabel>
          <Select
            value={subprojectFilter}
            label="Subproyecto"
            onChange={(event) => onSubprojectFilterChange(event.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {subprojects.map((subproject) => (
              <MenuItem key={subproject.id} value={subproject.id}>
                {subproject.name_subproject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default BecariosFilters;
