import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { regionService } from '../../services/api/region';
import { useToast } from '../../hooks/useToast';
import type { Region } from '../../types/api';
import { Status } from '../../types/api';

// Sub-components
import RegionesFilters from './regiones/RegionesFilters';
import RegionesDetailPanel from './regiones/RegionesDetailPanel';
import RegionesCreateDialog from './regiones/RegionesCreateDialog';
import RegionesEditDialog from './regiones/RegionesEditDialog';
import RegionesDeleteDialog from './regiones/RegionesDeleteDialog';

interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const Regiones: React.FC = () => {
  const { showToast } = useToast();

  // State for data
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // State for UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // State for modals
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // State for loading
  const [loading, setLoading] = useState<LoadingState>({
    list: true,
    create: false,
    update: false,
    delete: false,
  });

  // Comentado: No ser usa en esta versión
  // const STATUS_ID_BY_VALUE = useMemo(() => {
  //   return Object.entries(Status).reduce(...
  // }, []);

  const getStatusLabel = useCallback((statusId?: string): string => {
    if (!statusId) return 'Sin estado';
    const statusValue = Status[statusId as keyof typeof Status];
    if (statusValue) {
      return `${statusValue.charAt(0)}${statusValue.slice(1).toLowerCase()}`;
    }
    return 'Sin estado';
  }, []);

  const getStatusColor = useCallback((statusId?: string): string => {
    if (!statusId) return '#9ca3af';
    const statusValue = Status[statusId as keyof typeof Status];
    if (statusValue === 'ACTIVO') return '#26C6DA';
    if (statusValue === 'ELIMINADO') return '#ef4444';
    if (statusValue === 'INACTIVO') return '#3b82f6';
    return '#9ca3af';
  }, []);

  // Load regions
  const loadRegiones = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));
      const response = await regionService.getAll();
      setRegiones(response?.data || []);
      setSelectedRegion(null);
    } catch (error) {
      console.error('Error loading regiones:', error);
      showToast('Error al cargar las regiones', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, list: false }));
    }
  }, [showToast]);

  useEffect(() => {
    loadRegiones();
  }, [loadRegiones]);

  // Filter regions
  const filteredRegiones = useMemo(() => {
    return regiones.filter((region) => {
      const searchMatch = (region.name_region ?? region.name ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let statusMatch = true;
      if (statusFilter) {
        const regionStatusValue = region.status_id ? Status[region.status_id as keyof typeof Status] : undefined;
        statusMatch = regionStatusValue === statusFilter.toUpperCase();
      }

      return searchMatch && statusMatch;
    });
  }, [regiones, searchTerm, statusFilter]);

  // Pagination
  const paginatedRegiones = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredRegiones.slice(start, start + rowsPerPage);
  }, [filteredRegiones, page, rowsPerPage]);

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Create region
  const handleCreateRegion = useCallback(
    async (data: Omit<Region, 'id'>) => {
      try {
        setLoading((prev) => ({ ...prev, create: true }));
        const newRegion = await regionService.create(data);
        setRegiones((prev) => [...prev, newRegion?.data || newRegion]);
        setShowCreateDialog(false);
        showToast('Región creada exitosamente', 'success');
      } catch (error) {
        console.error('Error creating region:', error);
        showToast('Error al crear la región', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [showToast]
  );

  // Update region
  const handleUpdateRegion = useCallback(
    async (id: string, data: Partial<Region>) => {
      try {
        setLoading((prev) => ({ ...prev, update: true }));
        const updatedRegion = await regionService.updateById(id, data);
        setRegiones((prev) => prev.map((r) => (r.id === id ? (updatedRegion?.data || updatedRegion) : r)));
        setSelectedRegion(updatedRegion?.data || updatedRegion);
        setShowEditDialog(false);
        showToast('Región actualizada exitosamente', 'success');
      } catch (error) {
        console.error('Error updating region:', error);
        showToast('Error al actualizar la región', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [showToast]
  );

  // Delete region
  const handleDeleteRegion = useCallback(
    async (id: string) => {
      try {
        setLoading((prev) => ({ ...prev, delete: true }));
        await regionService.deleteById(id);
        setRegiones((prev) => prev.filter((r) => r.id !== id));
        setSelectedRegion(null);
        setShowDeleteDialog(false);
        showToast('Región eliminada exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting region:', error);
        showToast('Error al eliminar la región', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    },
    [showToast]
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#1e293b' }}>Regiones</h1>
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>Gestión de regiones del sistema</p>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setShowCreateDialog(true)}
          sx={{
            bgcolor: '#26C6DA',
            '&:hover': { bgcolor: '#00BCD4' },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 1.5,
          }}
        >
          Nueva Región
        </Button>
      </Box>

      {/* Filters */}
      <RegionesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        resultCount={filteredRegiones.length}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row-reverse' } }}>
        {/* Detail Panel */}
        <Box sx={{ flex: { lg: '0 0 320px' } }}>
          <RegionesDetailPanel region={selectedRegion} getStatusLabel={getStatusLabel} getStatusColor={getStatusColor} />
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1 }}>
          {loading.list ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px' }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px', width: 140 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRegiones.map((region) => (
                      <TableRow
                        key={region.id}
                        hover
                        onClick={() => setSelectedRegion(region)}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(38, 198, 218, 0.04)',
                          },
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <TableCell sx={{ color: '#1e293b', fontWeight: 500 }}>{region.name_region ?? region.name ?? 'Sin nombre'}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(region.status_id)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(region.status_id),
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRegion(region);
                              }}
                              sx={{
                                color: '#26C6DA',
                                textTransform: 'none',
                                fontSize: '12px',
                                '&:hover': { bgcolor: 'rgba(38, 198, 218, 0.1)' },
                              }}
                            >
                              Ver
                            </Button>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRegion(region);
                                setShowEditDialog(true);
                              }}
                              sx={{
                                color: '#0ea5e9',
                                textTransform: 'none',
                                fontSize: '12px',
                                '&:hover': { bgcolor: 'rgba(14, 165, 233, 0.1)' },
                              }}
                            />
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRegion(region);
                                setShowDeleteDialog(true);
                              }}
                              sx={{
                                color: '#ef4444',
                                textTransform: 'none',
                                fontSize: '12px',
                                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredRegiones.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid #e2e8f0',
                  bgcolor: '#f8f9fa',
                  '& .MuiTablePagination-selectLabel': { margin: 0 },
                  '& .MuiTablePagination-displayedRows': { margin: 0 },
                }}
              />
            </Card>
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <RegionesCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateRegion}
        loading={loading.create}
      />

      {selectedRegion && (
        <RegionesEditDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          region={selectedRegion}
          onSubmit={(data) => handleUpdateRegion(selectedRegion.id, data)}
          loading={loading.update}
        />
      )}

      {selectedRegion && (
        <RegionesDeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          region={selectedRegion}
          onConfirm={() => handleDeleteRegion(selectedRegion.id)}
          loading={loading.delete}
        />
      )}
    </Box>
  );
};

export default Regiones;
