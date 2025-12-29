import React from "react";
import { Box, Typography, Container } from "@mui/material";
import kuxtal from "../../core/assets/images/logo_kuxtal.png";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background:
            "linear-gradient(to right, #FFD700 0%, #FFD700 10%, #1E3A8A 10%, #1E3A8A 20%, #26C6DA 20%, #26C6DA 30%, #DC2626 30%, #DC2626 40%, #FFD700 40%, #FFD700 50%, #1E3A8A 50%, #1E3A8A 60%, #26C6DA 60%, #26C6DA 70%, #DC2626 70%, #DC2626 80%, #FFD700 80%, #FFD700 90%, #1E3A8A 90%, #1E3A8A 100%)",
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#26C6DA",
              fontSize: { xs: "12px", sm: "14px" },
              lineHeight: 1.4,
              order: { xs: 2, sm: 1 },
            }}
          >
            ©Kuxtal 2024
            <br />
            64 Gallegos
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#26C6DA",
              fontSize: { xs: "12px", sm: "14px" },
              cursor: "pointer",
              order: { xs: 3, sm: 2 },
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Contáctanos
          </Typography>
          <Box
            sx={{
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 60, sm: 80, md: 100 },
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              order: { xs: 1, sm: 3 },
            }}
          >
            <img
              src={kuxtal}
              alt="Logo Kuxtal"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
