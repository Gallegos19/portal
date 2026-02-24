import React from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface CapacitacionesFiltersProps {
  searchTerm: string;
  audienceFilter: string;
  onSearchChange: (value: string) => void;
  onAudienceFilterChange: (value: string) => void;
}

const CapacitacionesFilters: React.FC<CapacitacionesFiltersProps> = ({
  searchTerm,
  audienceFilter,
  onSearchChange,
  onAudienceFilterChange,
}) => {
  return (
    <Box display="flex" gap={2} mb={3}>
      <TextField
        size="small"
        placeholder="Buscar capacitación..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: { borderRadius: 4, bgcolor: 'background.paper' },
        }}
        sx={{ width: 320 }}
      />

      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel>Filtrar por audiencia</InputLabel>
        <Select
          value={audienceFilter}
          label="Filtrar por audiencia"
          onChange={(e: SelectChangeEvent) => onAudienceFilterChange(e.target.value)}
          sx={{ borderRadius: 4 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          <MenuItem value="Becario">Becario</MenuItem>
          <MenuItem value="Facilitador">Facilitador</MenuItem>
          <MenuItem value="Ambos">Ambos</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default CapacitacionesFilters;
