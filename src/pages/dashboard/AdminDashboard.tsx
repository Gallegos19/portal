import React from "react";
import { Box, Typography, Container, Chip } from "@mui/material";
import bob from "../../core/assets/images/BOB_HENTZEN.png";
import nadine from "../../core/assets/images/NADINE.png";
import jerry from "../../core/assets/images/JERRY_TOLLE.png";
import bud from "../../core/assets/images/BUD_HENTZEN.png";
import jim from "../../core/assets/images/JIM_HENTZEN.png";

const AdminDashboard: React.FC = () => {
  return (
    <>
      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: { xs: "center", md: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 4, md: 6 },
          textAlign: { xs: "center", md: "left" }
        }}>
          {/* Imagen de Bob Hentzen */}
          <Box
            sx={{
              width: { xs: 150, sm: 180, md: 200 },
              height: { xs: 150, sm: 180, md: 200 },
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              <img src={bob} alt="" />
            </Box>
          </Box>

          {/* Contenido de Bienvenida */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h3"
              sx={{ 
                fontWeight: 700, 
                color: "#1e293b", 
                mb: 4,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
              }}
            >
              Bienvenido al nuevo sistema del proyecto Kuxtal
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                lineHeight: 1.6,
                mb: 4,
              }}
            >
              Estamos aquí para facilitar la organización y el acceso a la
              información de manera sencilla y eficiente. Juntos, construimos un
              futuro más conectado y solidario. 😊
            </Typography>

            <Typography
              variant="h6"
              sx={{ 
                fontWeight: 600, 
                color: "#1e293b", 
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" }
              }}
            >
              BOB HENTZEN
            </Typography>

            {/* Secciones destacadas para Admin */}
            <Box sx={{ 
              display: "flex", 
              gap: 2, 
              mt: 4,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" }
            }}>
              <Chip
                label="Historias de éxito ✓"
                sx={{
                  bgcolor: "#dcfce7",
                  color: "#166534",
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  height: "auto",
                }}
              />
              <Chip
                label="Capacitaciones 📚"
                sx={{
                  bgcolor: "#dbeafe",
                  color: "#1e40af",
                  fontWeight: 600,
                  px: 2,
                  py: 1,
                  height: "auto",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Sección de Historia */}
        <Box sx={{ mt: 8 }}>
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: 700, 
              color: "#1e293b", 
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Nuestra historia nos representa y es vital recordar a quienes fueron
            clave para nuestro proyecto
          </Typography>

          {/* Galería de fundadores */}
          <Box
            sx={{
              display: "flex",
              mt: 6,
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: "center",
              maxWidth: "900px",
              mx: "auto",
              px: { xs: 2, sm: 4 },
              flexWrap: { xs: "wrap", sm: "nowrap" },
              gap: { xs: 3, sm: 0 },
            }}
          >
            {[
              { name: "JERRY TOLLE", photo: jerry },
              { name: "JIM HENTZEN", photo: jim },
              { name: "NADINE (HENTZEN) PEARCE", photo: nadine },
              { name: "BUD HENTZEN", photo: bud },
            ].map((founder, index) => (
              <Box key={index} sx={{ 
                textAlign: "center",
                flex: { xs: "0 0 calc(50% - 12px)", sm: "1" },
                maxWidth: { xs: "150px", sm: "none" }
              }}>
                <Box
                  sx={{
                    width: { xs: 120, sm: 130, md: 150 },
                    height: { xs: 120, sm: 130, md: 150 },
                    borderRadius: "50%",
                    overflow: "hidden",
                    bgcolor: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  <img
                    src={founder.photo}
                    alt={founder.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ 
                    fontWeight: 600, 
                    color: "#1e293b",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }}
                >
                  {founder.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;
