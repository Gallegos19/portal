import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Avatar,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AutoStories as AcademicIcon,
  CheckCircle as CheckCircleIcon,
  DeleteOutline as DeleteIcon,
  Description as DocumentIcon,
  DownloadOutlined as DownloadIcon,
  PersonOutline as PersonIcon,
  UploadFile as UploadIcon,
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';
import { useToast } from '../../hooks/useToast';
import { Status, type Document } from '../../types/api';
import { internService } from '../../services/api/intern';
import { documentService } from '../../services/api/document';
import { archiveService } from '../../services/api/archive';

type DocumentKind = 'personal' | 'academic';

interface DocumentosBaseProps {
  type: DocumentKind;
}

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getDocumentKindFromDescription = (description?: string): DocumentKind | null => {
  if (!description) return null;

  const normalized = normalizeText(description);

  if (normalized.includes('tipo: personal') || normalized.includes('tipo personal')) return 'personal';
  if (normalized.includes('tipo: academico') || normalized.includes('tipo academico')) return 'academic';

  return null;
};

const inferDocumentKind = (title?: string): DocumentKind | null => {
  const normalized = normalizeText(title || '');
  if (!normalized) return null;

  const personalKeywords = [
    'ine',
    'curp',
    'domicilio',
    'identificacion',
    'identidad',
    'rfc',
    'pasaporte',
    'acta',
    'nacimiento',
    'cedula',
  ];

  const academicKeywords = [
    'certificado',
    'carta',
    'historial',
    'academico',
    'academica',
    'constancia',
    'inscripcion',
    'boleta',
    'kardex',
    'estudios',
  ];

  if (personalKeywords.some((keyword) => normalized.includes(keyword))) return 'personal';
  if (academicKeywords.some((keyword) => normalized.includes(keyword))) return 'academic';

  return null;
};

const getExtensionLabel = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toUpperCase();
  return extension || 'ARCHIVO';
};

const getTitleFromFileName = (fileName: string): string => {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, '');
  return withoutExtension.trim();
};

const formatDate = (value?: string): string => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const statusLabels = Status as Record<string, string>;

const isDeletedDocument = (doc: Document): boolean => {
  if (!doc.status_id) return false;
  return (statusLabels[doc.status_id] || '').toUpperCase() === 'ELIMINADO';
};

const DocumentosBase: React.FC<DocumentosBaseProps> = ({ type }) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [internId, setInternId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const content = useMemo(
    () =>
      type === 'personal'
        ? {
            title: 'Documentos Personales',
            subtitle: 'Sube y consulta tus documentos personales de forma ordenada.',
            icon: <PersonIcon fontSize="small" />,
            typeText: 'Personal',
            empty: 'No hay documentos personales registrados.',
            requiredTypes: [
              'Identificación oficial',
              'Comprobante de domicilio',
              'CURP',
              'RFC',
            ],
          }
        : {
            title: 'Documentos Académicos',
            subtitle: 'Administra tus comprobantes y evidencias académicas.',
            icon: <AcademicIcon fontSize="small" />,
            typeText: 'Académico',
            empty: 'No hay documentos académicos registrados.',
            requiredTypes: [
              'Certificado de estudios',
              'Carta de aceptación',
              'Historial académico',
              'Comprobante de inscripción',
            ],
          },
    [type]
  );

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setErrorMessage(null);

      const internResponse = await internService.getByUserId(user.id);
      const currentInternId = internResponse.data.id;
      setInternId(currentInternId);

      const documentsResponse = await documentService.getByInternId(currentInternId);
      setDocuments(documentsResponse.data || []);
    } catch (error) {
      console.error('Error cargando documentos de becario:', error);
      setErrorMessage('No se pudieron cargar tus documentos.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (isDeletedDocument(doc)) return false;

      const byDescription = getDocumentKindFromDescription(doc.description);
      if (byDescription) return byDescription === type;

      const byTitle = inferDocumentKind(doc.title);
      if (byTitle) return byTitle === type;

      return false;
    });
  }, [documents, type]);

  const handleSelectFileClick = () => {
    inputRef.current?.click();
  };

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';

    if (!selectedFile) return;

    const fallbackTitle = getTitleFromFileName(selectedFile.name);
    const trimmedTitle = uploadTitle.trim() || fallbackTitle;
    if (!trimmedTitle) {
      showToast('Ingresa el título del documento antes de subirlo.', 'warning');
      return;
    }

    if (!user?.id || !internId) {
      showToast('No se pudo identificar tu usuario para subir el documento.', 'error');
      return;
    }

    try {
      setUploading(true);

      const archiveResponse = await archiveService.uploadFile(
        selectedFile,
        user.id,
        selectedFile.type || 'application/octet-stream',
        type === 'personal' ? 'documentos/personales' : 'documentos/academicos'
      );

      const description = `Tipo: ${content.typeText}`;

      await documentService.create({
        title: trimmedTitle,
        description,
        id_intern: internId,
        document_type: type === 'personal' ? 'personal' : 'academico',
        id_archive: archiveResponse.data.id,
      });

      setUploadTitle('');
      showToast('Documento subido correctamente.', 'success');
      await loadDocuments();
    } catch (error) {
      console.error('Error subiendo documento:', error);
      showToast('No se pudo subir el documento.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.id_archive) {
      showToast('El documento no tiene archivo disponible para descarga.', 'warning');
      return;
    }

    try {
      const response = await archiveService.getSignedUrl(doc.id_archive, 300);
      window.open(response.data.signed_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error descargando documento:', error);
      showToast('No se pudo descargar el documento.', 'error');
    }
  };

  const handleDelete = async (doc: Document) => {
    const confirmed = window.confirm(`¿Deseas eliminar el documento "${doc.title}"?`);
    if (!confirmed) return;

    try {
      setDeletingId(doc.id);
      await documentService.deleteById(doc.id);
      showToast('Documento eliminado correctamente.', 'success');
      await loadDocuments();
    } catch (error) {
      console.error('Error eliminando documento:', error);
      showToast('No se pudo eliminar el documento.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {content.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {content.subtitle}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2.5, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ md: 'center' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
              Subida rápida de documentos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              La descripción se guarda automáticamente como <strong>{`Tipo: ${content.typeText}`}</strong>.
            </Typography>
          </Box>
          <TextField
            size="small"
            label="Título del documento"
            placeholder="Ej. Constancia de inscripción"
            value={uploadTitle}
            onChange={(event) => setUploadTitle(event.target.value)}
            sx={{ minWidth: { xs: '100%', md: 280 } }}
          />
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleSelectFileClick}
            disabled={uploading || loading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            {uploading ? 'Subiendo...' : 'Subir documento'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleUploadFile}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </Stack>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Chip icon={content.icon} label={content.typeText} color="primary" variant="outlined" size="small" />
        <Chip label={`${filteredDocuments.length} documento(s)`} size="small" />
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 7 }}>
          <CircularProgress />
        </Box>
      ) : filteredDocuments.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <DocumentIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
          <Typography color="text.secondary">{content.empty}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Al subir un archivo se registrará automáticamente como tipo {content.typeText.toLowerCase()} en la descripción.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {filteredDocuments.map((doc) => (
            <Paper
              key={doc.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: type === 'personal' ? '4px solid' : '4px solid',
                borderLeftColor: type === 'personal' ? 'primary.main' : 'secondary.main',
              }}
            >
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                <Stack direction="row" spacing={1.5} sx={{ minWidth: 0, flex: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <DocumentIcon />
                  </Avatar>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap title={doc.title}>
                      {doc.title}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
                      <Chip label={getExtensionLabel(doc.title)} size="small" variant="outlined" />
                      <Chip label={`Tipo: ${content.typeText}`} size="small" color="primary" variant="outlined" />
                      <Chip
                        label={formatDate((doc as Document & { created_at?: string }).created_at)}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {doc.description || `Tipo: ${content.typeText}`}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ alignSelf: { xs: 'flex-end', md: 'center' } }}>
                  <Tooltip title="Descargar">
                    <span>
                      <IconButton color="primary" onClick={() => handleDownload(doc)}>
                        <DownloadIcon />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Eliminar">
                    <span>
                      <IconButton color="error" onClick={() => handleDelete(doc)} disabled={deletingId === doc.id}>
                        <DeleteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
          Documentos requeridos ({content.typeText})
        </Typography>
        <Stack spacing={1}>
          {content.requiredTypes.map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
};

export default DocumentosBase;
