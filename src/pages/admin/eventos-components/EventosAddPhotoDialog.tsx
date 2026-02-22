import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  LinearProgress,
  Alert,
  TextField,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Close as CloseIcon } from '@mui/icons-material';
import { uploadService } from '../../../services/api/upload';
import { photoService } from '../../../services/api/photo';
import { eventPhotoService } from '../../../services/api/eventPhoto';

interface EventosAddPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string;
  userId: string;
  onPhotoAdded: () => void;
}

const EventosAddPhotoDialog: React.FC<EventosAddPhotoDialogProps> = ({
  open,
  onClose,
  eventId,
  userId,
  onPhotoAdded,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('El archivo no debe superar 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
      // Auto-fill title if empty
      if (!photoTitle) {
        setPhotoTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const event = {
        target: {
          files: [file],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !photoTitle.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!userId) {
      setError('No se pudo identificar al usuario. Por favor inicia sesión nuevamente.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Upload archive
      const archive = await uploadService.uploadFile(
        selectedFile,
        userId,
        'imagen',
        'fotos',
        setUploadProgress
      );

      // 2. Create photo
      const photoResponse = await photoService.create({
        title: photoTitle,
        description: '',
        id_archive: archive.id,
      });

      // 3. Link photo to event
      await eventPhotoService.create({
        id_event: eventId,
        id_photo: photoResponse.data.id,
      });

      // Reset and close
      setSelectedFile(null);
      setPhotoTitle('');
      setUploadProgress(0);
      onPhotoAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la foto');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFile(null);
      setPhotoTitle('');
      setUploadProgress(0);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CloudUploadIcon sx={{ color: '#26C6DA' }} />
        Agregar Foto al Evento
        {!loading && (
          <CloseIcon
            onClick={handleClose}
            sx={{
              ml: 'auto',
              cursor: 'pointer',
              '&:hover': { color: 'error.main' },
            }}
          />
        )}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* File Upload Area */}
          <Box
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '2px dashed #cbd5e1',
              borderRadius: 2,
              p: 3,
              cursor: 'pointer',
              backgroundColor: selectedFile ? '#f0f9ff' : '#f8f9fa',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#f0f9ff',
                borderColor: '#26C6DA',
              },
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: '#26C6DA' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {selectedFile ? selectedFile.name : 'Arrastra una imagen aquí o haz clic'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Formato: JPG, PNG | Máximo: 10MB
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </Box>

          {/* Photo Title */}
          <TextField
            label="Título de la Foto"
            value={photoTitle}
            onChange={(e) => setPhotoTitle(e.target.value)}
            fullWidth
            disabled={loading}
            placeholder="Ej. Foto de grupo en la reunión"
          />

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Subiendo... {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedFile || !photoTitle.trim() || loading}
          sx={{
            background: 'linear-gradient(135deg, #26C6DA 0%, #00BCD4 100%)',
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          {loading ? 'Subiendo...' : 'Agregar Foto'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventosAddPhotoDialog;
