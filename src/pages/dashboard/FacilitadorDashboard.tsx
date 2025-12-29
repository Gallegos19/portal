import React from "react";
import { Box, Typography, Container } from "@mui/material";
import bob from "../../core/assets/images/BOB_HENTZEN.png";
import nadine from "../../core/assets/images/NADINE.png";
import jerry from "../../core/assets/images/JERRY_TOLLE.png";
import bud from "../../core/assets/images/BUD_HENTZEN.png";
import jim from "../../core/assets/images/JIM_HENTZEN.png";

const FacilitadorDashboard: React.FC = () => {
  return (
    <>
      {/* Contenido Principal */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "flex-start" }, 
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
                mb: 2,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
              }}
            >
              Bienvenido al nuevo sistema del
            </Typography>
            <Typography
              variant="h3"
              sx={{ 
                fontWeight: 700, 
                color: "#1e293b", 
                mb: 4,
                fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" }
              }}
            >
              proyecto Kuxtal
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontSize: { xs: "16px", sm: "17px", md: "18px" },
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
                mb: 2,
                fontSize: { xs: "1.1rem", sm: "1.25rem" }
              }}
            >
              BOB HENTZEN
            </Typography>
          </Box>
        </Box>

        {/* Sección de Historia */}
        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Typography
            variant="h4"
            sx={{ 
              fontWeight: 700, 
              color: "#1e293b", 
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
              textAlign: { xs: "center", md: "left" }
            }}
          >
            Nuestra historia nos representa y es vital recordar a quienes fueron
            clave para nuestro proyecto
          </Typography>

          {/* Galería de fundadores */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { 
                xs: "repeat(2, 1fr)", 
                sm: "repeat(2, 1fr)", 
                md: "repeat(4, 1fr)" 
              },
              gap: { xs: 3, sm: 4, md: 6 },
              mt: { xs: 4, md: 6 },
              maxWidth: "900px",
              mx: "auto",
              px: { xs: 2, sm: 4 },
            }}
          >
            {[
              { name: "JERRY TOLLE", photo: jerry },
              { name: "JIM HENTZEN", photo: jim },
              { name: "NADINE (HENTZEN) PEARCE", photo: nadine },
              { name: "BUD HENTZEN", photo: bud },
            ].map((founder, index) => (
              <Box key={index} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: { xs: 120, sm: 140, md: 150 },
                    height: { xs: 120, sm: 140, md: 150 },
                    borderRadius: "50%",
                    bgcolor: "#e2e8f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    fontSize: "12px",
                    color: "#64748b",
                    overflow: "hidden",
                    mx: "auto",
                  }}
                >
                  <img src={founder.photo} alt={founder.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

export default FacilitadorDashboard;
