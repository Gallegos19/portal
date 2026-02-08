import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../../core/assets/images/2014-unbound.jpg";
import unboundLogo from "../../core/assets/images/unbound-logo.webp";
import {
  Box,
  Card,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Typography,
  Fade,
  Slide,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  CheckCircleOutline,
  ErrorOutline,
} from "@mui/icons-material";
import { useAuthStore } from "../../store/authStore";
import { ROUTES, USER_ROLES } from "../../utils/constants";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [passwordValid, setPasswordValid] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  // Función para validar formato de email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Validación en tiempo real para email
  useEffect(() => {
    if (email.length === 0) {
      setEmailValid(null);
    } else if (isValidEmail(email)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  }, [email]);

  // Validación en tiempo real para contraseña
  useEffect(() => {
    if (password.length === 0) {
      setPasswordValid(null);
    } else if (password.length >= 6) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });

      // Redirect based on user role
      const user = useAuthStore.getState().user;
      if (user) {
        switch (user.role) {
          case USER_ROLES.BECARIO:
            navigate(ROUTES.BECARIO.HOME);
            break;
          case USER_ROLES.FACILITADOR:
            navigate(ROUTES.FACILITADOR.HOME);
            break;
          case USER_ROLES.ADMIN:
            navigate(ROUTES.ADMIN.HOME);
            break;
          default:
            navigate("/");
        }
      }
    } catch (err: any) {
      // Manejar errores de autenticación
      const status = err?.response?.status;
      let errorMessage = "";
      
      if (status === 401 || status === 403) {
        errorMessage = "Correo o contraseña incorrecta. Por favor, verifica tus credenciales.";
      } else if (status === 404) {
        errorMessage = "Usuario no encontrado. Verifica tu correo electrónico.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else {
        errorMessage = "Error al iniciar sesión. Por favor, intenta nuevamente.";
      }
      
      setError(errorMessage);
      console.error("Error de login:", err);
    }
  };

  return (
    <Fade in={mounted} timeout={800}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          bgcolor: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left side - Background Image con overlay mejorado */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "50%",
            backgroundImage: `url(${image1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            position: "relative",
            borderRight: "4px solid #26C6DA",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(38, 198, 218, 0.1) 0%, rgba(0, 188, 212, 0.2) 100%)",
            },
          }}
        >
          {/* Mensaje inspiracional */}
          <Slide direction="right" in={mounted} timeout={1000}>
            <Box
              sx={{
                position: "absolute",
                bottom: 40,
                left: 40,
                right: 40,
                zIndex: 1,
                color: "white",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Bienvenido
              </Typography>
              <Typography
                variant="body1"
                sx={{ opacity: 0.9, fontSize: "16px" }}
              >
                Conectando comunidades, transformando vidas
              </Typography>
            </Box>
          </Slide>
        </Box>

        {/* Right side - Login form mejorado */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            position: "relative",
          }}
        >
          {/* Elementos decorativos de fondo */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "10%",
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #26C6DA20, #00BCD420)",
              animation: "float 6s ease-in-out infinite",
              "@keyframes float": {
                "0%, 100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(-20px)" },
              },
            }}
          />

          <Slide direction="left" in={mounted} timeout={1000}>
            <Card
              sx={{
                width: "100%",
                maxWidth: 420,
                p: 5,
                borderRadius: 4,
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.08), 0 8px 25px rgba(0,0,0,0.06)",
                bgcolor: "white",
                border: "1px solid rgba(38, 198, 218, 0.1)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow:
                    "0 25px 70px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {/* Header mejorado */}
              <Box sx={{ textAlign: "center", mb: 5 }}>
                <Fade in={mounted} timeout={1200}>
                  <Box
                    component="img"
                    src={unboundLogo}
                    alt="UNBOUND"
                    sx={{
                      height: 45,
                      mb: 3,
                      filter: "drop-shadow(0 2px 8px rgba(38, 198, 218, 0.2))",
                    }}
                  />
                </Fade>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#1e293b",
                    mb: 1,
                  }}
                >
                  Iniciar Sesión
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  Accede a tu portal UNBOUND
                </Typography>
              </Box>

              {/* Formulario mejorado */}
              <Box component="form" onSubmit={handleSubmit}>
                {/* Campo Correo Electrónico */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#26C6DA",
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    <PersonOutline sx={{ fontSize: 18, mr: 1 }} />
                    Correo Electrónico
                    <Chip
                      label="*"
                      size="small"
                      sx={{
                        ml: 1,
                        height: 16,
                        fontSize: "10px",
                        bgcolor: "#fee2e2",
                        color: "#dc2626",
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    required
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor:
                            emailValid === false ? "#ef4444" : "#e2e8f0",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            emailValid === false ? "#ef4444" : "#26C6DA",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            emailValid === false ? "#ef4444" : "#26C6DA",
                          boxShadow: `0 0 0 3px ${emailValid === false ? "#fecaca" : "#a7f3d0"}`,
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "14px 16px",
                        fontSize: "15px",
                      },
                    }}
                    slotProps={{
                      input: {
                        endAdornment: emailValid === true && (
                          <InputAdornment position="end">
                            <CheckCircleOutline
                              sx={{ color: "#10b981", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  {emailValid === false && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        fontSize: "12px",
                      }}
                    >
                      <ErrorOutline sx={{ fontSize: 14, mr: 0.5 }} />
                      Por favor, ingresa un correo electrónico válido
                    </Typography>
                  )}
                </Box>

                {/* Campo Contraseña mejorado */}
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      color: "#26C6DA",
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    <LockOutlined sx={{ fontSize: 18, mr: 1 }} />
                    Contraseña
                    <Chip
                      label="*"
                      size="small"
                      sx={{
                        ml: 1,
                        height: 16,
                        fontSize: "10px",
                        bgcolor: "#fee2e2",
                        color: "#dc2626",
                      }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su contraseña"
                    required
                    variant="outlined"
                    size="medium"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8fafc",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor:
                            passwordValid === false ? "#ef4444" : "#e2e8f0",
                          borderWidth: "2px",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            passwordValid === false ? "#ef4444" : "#26C6DA",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            passwordValid === false ? "#ef4444" : "#26C6DA",
                          boxShadow: `0 0 0 3px ${passwordValid === false ? "#fecaca" : "#a7f3d0"}`,
                        },
                      },
                      "& .MuiInputBase-input": {
                        padding: "14px 16px",
                        fontSize: "15px",
                      },
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {passwordValid === true && (
                                <CheckCircleOutline
                                  sx={{ color: "#10b981", fontSize: 20 }}
                                />
                              )}
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    bgcolor: "#f1f5f9",
                                  },
                                }}
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </Box>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  {passwordValid === false && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        fontSize: "12px",
                      }}
                    >
                      <ErrorOutline sx={{ fontSize: 14, mr: 0.5 }} />
                      La contraseña debe tener al menos 6 caracteres
                    </Typography>
                  )}
                </Box>

                {/* Error message mejorado */}
                {error && (
                  <Fade in={!!error}>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 2,
                        fontSize: "14px",
                        border: "1px solid #fecaca",
                        bgcolor: "#fef2f2",
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Botón Ingresar mejorado */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={
                    !email ||
                    !password ||
                    isLoading ||
                    emailValid === false ||
                    passwordValid === false
                  }
                  sx={{
                    bgcolor: "#26C6DA",
                    color: "white",
                    py: 2,
                    borderRadius: 2,
                    fontSize: "15px",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 4px 14px rgba(38, 198, 218, 0.3)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "#00BCD4",
                      boxShadow: "0 6px 20px rgba(38, 198, 218, 0.4)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    },
                    "&:disabled": {
                      bgcolor: "#e2e8f0",
                      color: "#94a3b8",
                      boxShadow: "none",
                      transform: "none",
                    },
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        size={18}
                        sx={{ color: "white", mr: 1 }}
                      />
                      Ingresando...
                    </Box>
                  ) : (
                    "Ingresar"
                  )}
                </Button>       
              </Box>
            </Card>
          </Slide>
        </Box>
      </Box>
    </Fade>
  );
};

export default LoginPage;
