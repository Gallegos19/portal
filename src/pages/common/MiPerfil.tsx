import React, { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { Grid } from '@mui/material';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Work,
  Edit,
  Save,
  Cancel,
  School,
  CalendarToday,
} from "@mui/icons-material";

const MiPerfil: React.FC = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Determinar el rol y configuración específica
  const getRoleConfig = () => {
    const userRole = user?.role?.toLowerCase();
    switch (userRole) {
      case "admin":
        return {
          roleLabel: "Administrador",
          roleColor: "#dc2626",
          roleBgColor: "#fef2f2",
          department: "Administración",
          position: "Administrador General",
        };
      case "facilitador":
        return {
          roleLabel: "Facilitador Social",
          roleColor: "#7c3aed",
          roleBgColor: "#f3e8ff",
          department: "Trabajo Social",
          position: "Facilitador de Campo",
        };
      case "becario":
      default:
        return {
          roleLabel: "Becario",
          roleColor: "#166534",
          roleBgColor: "#dcfce7",
          department: "Estudiante",
          position: "Beneficiario del Programa",
        };
    }
  };

  const roleConfig = getRoleConfig();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "+502 1234-5678",
    address: "Guatemala City",
    birthDate: "1995-03-15",
    joinDate: "2024-01-15",
    // Campos específicos para becarios
    studentId: "EST-2024-001",
    institution: "Universidad de San Carlos",
    career: "Ingeniería en Sistemas",
    semester: "8vo semestre",
    // Contacto de emergencia
    emergencyContact: {
      name: "María Pérez",
      phone: "+502 8765-4321",
      relationship: "Madre",
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("emergencyContact.")) {
      const contactField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "+502 1234-5678",
      address: "Guatemala City",
      birthDate: "1995-03-15",
      joinDate: "2024-01-15",
      studentId: "EST-2024-001",
      institution: "Universidad de San Carlos",
      career: "Ingeniería en Sistemas",
      semester: "8vo semestre",
      emergencyContact: {
        name: "María Pérez",
        phone: "+502 8765-4321",
        relationship: "Madre",
      },
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4, 
        minHeight: 'calc(79vh)', // Ajusta según el tamaño de tu header
        display: 'flex',
        flexDirection: 'column'
      }} 
      ref={topRef}
    >
      <Paper 
        elevation={2} 
        sx={{ 
          p: 4, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#1e293b" }}>
            Mi Perfil
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  sx={{ color: "#64748b", borderColor: "#64748b" }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{ bgcolor: "#26C6DA", "&:hover": { bgcolor: "#00BCD4" } }}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditClick}
                sx={{ bgcolor: "#26C6DA", "&:hover": { bgcolor: "#00BCD4" } }}
              >
                Editar Perfil
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Columna Izquierda - Avatar y Info Básica */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "center", md: "flex-start" },
                textAlign: { xs: "center", md: "left" },
                pr: { md: 3 },
                borderRight: { md: "1px solid #e2e8f0" },
                height: "fit-content",
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: "#26C6DA",
                  fontSize: "3rem",
                  mb: 3,
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
              >
                {formData.firstName.charAt(0)}
                {formData.lastName.charAt(0)}
              </Avatar>

              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}
              >
                {formData.firstName} {formData.lastName}
              </Typography>

              <Chip
                label={roleConfig.roleLabel}
                sx={{
                  bgcolor: roleConfig.roleBgColor,
                  color: roleConfig.roleColor,
                  fontWeight: 600,
                  mb: 3,
                  alignSelf: { xs: "center", md: "flex-start" },
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  width: "100%",
                }}
              >
                <Work sx={{ fontSize: 16, mr: 1, color: "#64748b" }} />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {roleConfig.position}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <CalendarToday sx={{ fontSize: 16, mr: 1, color: "#64748b" }} />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {formData.joinDate}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Columna Derecha - Información Detallada */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              {/* Información Académica - Solo para Becarios */}
              {user?.role?.toLowerCase() === "becario" && (
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
                  >
                    Información Académica
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <School sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Institución
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={formData.institution}
                          onChange={(e) =>
                            handleInputChange("institution", e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.institution}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <School sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Carrera
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={formData.career}
                          onChange={(e) =>
                            handleInputChange("career", e.target.value)
                          }
                          size="small"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.career}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <School sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Semestre actual
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          select
                          value={formData.semester}
                          onChange={(e) =>
                            handleInputChange("semester", e.target.value)
                          }
                          size="small"
                          SelectProps={{ native: true }}
                        >
                          <option value="1er semestre">1er semestre</option>
                          <option value="2do semestre">2do semestre</option>
                          <option value="3er semestre">3er semestre</option>
                          <option value="4to semestre">4to semestre</option>
                          <option value="5to semestre">5to semestre</option>
                          <option value="6to semestre">6to semestre</option>
                          <option value="7mo semestre">7mo semestre</option>
                          <option value="8vo semestre">8vo semestre</option>
                          <option value="9no semestre">9no semestre</option>
                          <option value="10mo semestre">10mo semestre</option>
                        </TextField>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.semester}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Contacto de Emergencia - Solo para Becarios */}
              {user?.role?.toLowerCase() === "becario" && (
                <Box sx={{ mb: 4 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
                  >
                    Contacto de Emergencia
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Person sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Nombre completo
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={formData.emergencyContact.name}
                          onChange={(e) =>
                            handleInputChange(
                              "emergencyContact.name",
                              e.target.value
                            )
                          }
                          size="small"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.emergencyContact.name}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Phone sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Teléfono
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          value={formData.emergencyContact.phone}
                          onChange={(e) =>
                            handleInputChange(
                              "emergencyContact.phone",
                              e.target.value
                            )
                          }
                          size="small"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.emergencyContact.phone}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Person sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Parentesco
                        </Typography>
                      </Box>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          select
                          value={formData.emergencyContact.relationship}
                          onChange={(e) =>
                            handleInputChange(
                              "emergencyContact.relationship",
                              e.target.value
                            )
                          }
                          size="small"
                          SelectProps={{ native: true }}
                        >
                          <option value="Madre">Madre</option>
                          <option value="Padre">Padre</option>
                          <option value="Hermano/a">Hermano/a</option>
                          <option value="Esposo/a">Esposo/a</option>
                          <option value="Hijo/a">Hijo/a</option>
                          <option value="Tío/a">Tío/a</option>
                          <option value="Abuelo/a">Abuelo/a</option>
                          <option value="Otro">Otro</option>
                        </TextField>
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ color: "#1e293b", pl: 3 }}
                        >
                          {formData.emergencyContact.relationship}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Información Laboral - Para Admin y Facilitador */}
              {(user?.role?.toLowerCase() === "admin" ||
                user?.role?.toLowerCase() === "facilitador") && (
                <Box>
                  <Divider sx={{ mb: 3 }} />
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#1e293b", mb: 3 }}
                  >
                    Información Laboral
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Work sx={{ color: "#64748b", mr: 1 }} />
                        <Typography
                          variant="body2"
                          sx={{ color: "#64748b", fontWeight: 500 }}
                        >
                          Departamento
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: "#1e293b", pl: 3 }}>
                        {roleConfig.department}
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#1e293b", pl: 4, mt: 1 }}>
                        {roleConfig.position}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MiPerfil;