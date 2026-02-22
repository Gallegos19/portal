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
  Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { eventService } from '../../services/api/event';
import { photoService } from '../../services/api/photo';
import { eventPhotoService } from '../../services/api/eventPhoto';
import { useToast } from '../../hooks/useToast';
import { useAuthStore } from '../../store/authStore';
import type { Event, Photo, EventPhoto } from '../../types/api';
import { Status } from '../../types/api';

// Sub-components
import EventosFilters from './eventos-components/EventosFilters';
import EventosDetailPanel from './eventos-components/EventosDetailPanel';
import EventosCreateDialog from './eventos-components/EventosCreateDialog';
import EventosEditDialog from './eventos-components/EventosEditDialog';
import EventosDeleteDialog from './eventos-components/EventosDeleteDialog';
import EventosAddPhotoDialog from './eventos-components/EventosAddPhotoDialog';

interface LoadingState {
  list: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const Eventos: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuthStore();

  // State for data
  const [eventos, setEventos] = useState<Event[]>([]);
  const [fotos, setFotos] = useState<Photo[]>([]);
  const [eventFotos, setEventFotos] = useState<EventPhoto[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // State for UI
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // State for modals
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddPhotoDialog, setShowAddPhotoDialog] = useState(false);

  // State for loading
  const [loading, setLoading] = useState<LoadingState>({
    list: true,
    create: false,
    update: false,
    delete: false,
  });

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

  // Mapa para obtener fotos de un evento
  const fotosMap = useMemo(() => {
    const map = new Map<string, Photo[]>();
    eventFotos.forEach((ef) => {
      const foto = fotos.find((f) => f.id === ef.id_photo);
      if (foto) {
        const existing = map.get(ef.id_event) || [];
        map.set(ef.id_event, [...existing, foto]);
      }
    });
    return map;
  }, [eventFotos, fotos]);

  // Load all data
  const loadData = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, list: true }));
      const [eventosRes, fotosRes] = await Promise.all([
        eventService.getAll(),
        photoService.getAll(),
      ]);
      setEventos(eventosRes?.data || []);
      setFotos(fotosRes?.data || []);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error loading data:', error);
      showToast('Error al cargar los datos', 'error');
    } finally {
      setLoading((prev) => ({ ...prev, list: false }));
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Load fotos for selected event
  const loadEventFotos = useCallback(async () => {
    if (selectedEvent) {
      try {
        const res = await eventPhotoService.getByEventId(selectedEvent.id);
        setEventFotos(res?.data || []);
      } catch (error) {
        console.error('Error loading event fotos:', error);
      }
    }
  }, [selectedEvent]);

  useEffect(() => {
    loadEventFotos();
  }, [loadEventFotos]);

  // Filter eventos
  const filteredEventos = useMemo(() => {
    return eventos.filter((event) => {
      const searchMatch = (event.title ?? '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let statusMatch = true;
      if (statusFilter) {
        const eventStatusValue = event.status_id ? Status[event.status_id as keyof typeof Status] : undefined;
        statusMatch = eventStatusValue === statusFilter.toUpperCase();
      }

      return searchMatch && statusMatch;
    });
  }, [eventos, searchTerm, statusFilter]);

  // Pagination
  const paginatedEventos = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredEventos.slice(start, start + rowsPerPage);
  }, [filteredEventos, page, rowsPerPage]);

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Create evento
  const handleCreateEvent = useCallback(
    async (data: Omit<Event, 'id'>) => {
      try {
        setLoading((prev) => ({ ...prev, create: true }));
        const newEvent = await eventService.create(data);
        setEventos((prev) => [...prev, newEvent?.data || newEvent]);
        setShowCreateDialog(false);
        showToast('Evento creado exitosamente', 'success');
      } catch (error) {
        console.error('Error creating event:', error);
        showToast('Error al crear el evento', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [showToast]
  );

  // Update evento
  const handleUpdateEvent = useCallback(
    async (id: string, data: Partial<Event>) => {
      try {
        setLoading((prev) => ({ ...prev, update: true }));
        const updatedEvent = await eventService.updateById(id, data);
        setEventos((prev) => prev.map((e) => (e.id === id ? (updatedEvent?.data || updatedEvent) : e)));
        setSelectedEvent(updatedEvent?.data || updatedEvent);
        setShowEditDialog(false);
        showToast('Evento actualizado exitosamente', 'success');
      } catch (error) {
        console.error('Error updating event:', error);
        showToast('Error al actualizar el evento', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, update: false }));
      }
    },
    [showToast]
  );

  // Delete evento
  const handleDeleteEvent = useCallback(
    async (id: string) => {
      try {
        setLoading((prev) => ({ ...prev, delete: true }));
        await eventService.deleteById(id);
        setEventos((prev) => prev.filter((e) => e.id !== id));
        setSelectedEvent(null);
        setShowDeleteDialog(false);
        showToast('Evento eliminado exitosamente', 'success');
      } catch (error) {
        console.error('Error deleting event:', error);
        showToast('Error al eliminar el evento', 'error');
      } finally {
        setLoading((prev) => ({ ...prev, delete: false }));
      }
    },
    [showToast]
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
          Eventos
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
          Gestión de eventos del sistema
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
            color: 'white',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 1.5,
            padding: '8px 16px',
            '&:hover': {
              background: 'linear-gradient(135deg, #1ea7b5 0%, #0098a8 100%)',
              boxShadow: '0 4px 12px rgba(38, 198, 218, 0.4)',
            },
          }}
        >
          Nuevo Evento
        </Button>
      </Box>

      {/* Filters */}
      <EventosFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        resultCount={filteredEventos.length}
      />

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', flexDirection: { xs: 'column', lg: 'row-reverse' } }}>
        {/* Detail Panel - Right side on large screens */}
        <Box sx={{ flex: '0 0 320px', minWidth: 0 }}>
          <EventosDetailPanel
            event={selectedEvent}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            fotos={fotosMap.get(selectedEvent?.id || '')}
            onAddPhotoClick={() => setShowAddPhotoDialog(true)}
          />
        </Box>

        {/* Table - Left side on large screens */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {loading.list ? (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            </Card>
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
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow sx={{ '& th': { textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Fotos</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '12px', width: 140 }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedEventos.map((event) => (
                      <TableRow
                        key={event.id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f0f9fa',
                          },
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500, color: '#1e293b' }}>
                          {event.title}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(event.status_id)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(event.status_id),
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#475569' }}>
                          {fotosMap.get(event.id)?.length || 0} foto{fotosMap.get(event.id)?.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              startIcon={<InfoIcon />}
                              onClick={() => setSelectedEvent(event)}
                              variant="text"
                              sx={{
                                color: '#26C6DA',
                                '&:hover': { backgroundColor: 'rgba(38, 198, 218, 0.08)' },
                              }}
                            />
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEditDialog(true);
                              }}
                              variant="text"
                              sx={{
                                color: '#0ea5e9',
                                '&:hover': { backgroundColor: 'rgba(14, 165, 233, 0.08)' },
                              }}
                            />
                            <Button
                              size="small"
                              startIcon={<DeleteIcon />}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowDeleteDialog(true);
                              }}
                              variant="text"
                              color="error"
                              sx={{
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' },
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
                count={filteredEventos.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid #e2e8f0',
                  '& .MuiTablePagination-toolbar': {
                    minHeight: 56,
                  },
                }}
              />
            </Card>
          )}
        </Box>
      </Box>

      {/* Dialogs */}
      <EventosCreateDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateEvent}
        loading={loading.create}
      />

      {selectedEvent && (
        <EventosEditDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          event={selectedEvent}
          onSubmit={(data: Partial<Event>) => handleUpdateEvent(selectedEvent.id, data)}
          loading={loading.update}
        />
      )}

      {selectedEvent && (
        <EventosDeleteDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          event={selectedEvent}
          onConfirm={() => handleDeleteEvent(selectedEvent.id)}
          loading={loading.delete}
        />
      )}

      {selectedEvent && (
        <EventosAddPhotoDialog
          open={showAddPhotoDialog}
          onClose={() => setShowAddPhotoDialog(false)}
          eventId={selectedEvent.id}
          userId={user?.id || ''}
          onPhotoAdded={() => {
            loadData();
            loadEventFotos();
            showToast('Foto agregada exitosamente', 'success');
          }}
        />
      )}
    </Box>
  );
};

export default Eventos;
