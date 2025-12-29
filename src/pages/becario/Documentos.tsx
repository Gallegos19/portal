import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDocs from '../../hooks/useDocs';
import {
  Box,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Chip,
  Card,
  CardContent,
  CardActions,
  Grid
} from '@mui/material';
import {
  Upload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  category: 'personal' | 'academic';
}

const Documentos: React.FC = () => {
  const { currentTab, setCurrentTab } = useDocs();
  const location = useLocation();
  const navigate = useNavigate();


  // const currentTab = location.pathname.includes('academicos') ? 1 : 
  //                    location.pathname.includes('personales') ? 0 : 0;


  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Certificado_Estudios_2024.pdf',
      type: 'Certificado de estudios',
      size: '2.1 MB',
      uploadDate: '2024-01-15',
      status: 'approved',
      category: 'academic'
    },
    {
      id: '2',
      name: 'Cedula_Identidad.pdf',
      type: 'Documento de identidad',
      size: '1.8 MB',
      uploadDate: '2024-01-10',
      status: 'approved',
      category: 'personal'
    },
    {
      id: '3',
      name: 'Carta_Aceptacion_Universidad.pdf',
      type: 'Carta de aceptación',
      size: '1.2 MB',
      uploadDate: '2024-01-08',
      status: 'pending',
      category: 'academic'
    }
  ]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    navigate(newValue === 0 ? '/becario/documentos-personales' : '/becario/documentos-academicos');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon color="success" fontSize="small" />;
      case 'pending':
        return <PendingIcon color="warning" fontSize="small" />;
      case 'rejected':
        return <CancelIcon color="error" fontSize="small" />;
      default:
        return <CheckCircleIcon color="disabled" fontSize="small" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Desconocido';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    currentTab === 0 ? doc.category === 'personal' : doc.category === 'academic'
  );

  const documentTypes = currentTab === 0
    ? ['Identificación oficial', 'Comprobante de domicilio', 'CURP', 'RFC']
    : ['Certificado de estudios', 'Carta de aceptación', 'Historial académico', 'Comprobante de inscripción'];

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 4,
          gap: 2
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Documentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Subir documento
          </Button>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3, overflow: 'hidden' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange} 
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label="Documentos Personales"
              sx={{ py: 2 }}
            />
            <Tab
              icon={<SchoolIcon />}
              iconPosition="start"
              label="Documentos Académicos"
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>


        {/* Documentos existentes */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            {currentTab === 0 ? 'Documentos Personales' : 'Documentos Académicos'}
          </Typography>

          {filteredDocuments.length > 0 ? (
            <Grid container spacing={2}>
              {filteredDocuments.map((doc) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id} sx={{ display: 'flex' }}>
                  <Paper elevation={0} sx={{ height: '100%', p: 0, bgcolor: 'transparent' }}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40, mr: 2 }}>
                            <DescriptionIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" noWrap>{doc.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{doc.size}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {getStatusIcon(doc.status)}
                            <Chip
                              size="small"
                              label={getStatusText(doc.status)}
                              color={
                                doc.status === 'approved' ? 'success' :
                                  doc.status === 'pending' ? 'warning' : 'error'
                              }
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                        <Tooltip title="Descargar">
                          <IconButton size="small" color="primary">
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
              <DescriptionIcon color="disabled" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No hay documentos {currentTab === 0 ? 'personales' : 'académicos'} cargados
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sube tus documentos para mantenerlos organizados y actualizados
              </Typography>
            </Paper>
          )}
        </Box>

        {/* Tipos de documentos requeridos */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Tipos de documentos {currentTab === 0 ? 'personales' : 'académicos'} requeridos
          </Typography>
          <Grid container spacing={2}>
            {documentTypes.map((type, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    bgcolor: 'background.paper'
                  }}
                >
                  <CheckCircleIcon
                    color="success"
                    sx={{ mr: 1.5, opacity: 0.7 }}
                  />
                  <Typography>{type}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Documentos;