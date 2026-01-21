import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  MenuList,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  Home,
  Assignment,
  Description,
  School,
  EmojiEvents,
  AccountCircle,
  Menu as MenuIcon,
  Person,
  Logout,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import unboundLogo from '../../core/assets/images/unbound-logo.webp';

const BecarioHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [reportsMenuAnchor, setReportsMenuAnchor] = useState<null | HTMLElement>(null);

  const [documentsMenuAnchor, setDocumentsMenuAnchor] = useState<null | HTMLElement>(null);
  const [documentsMenuOpen, setDocumentsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Inicio', icon: <Home />, path: '/becario', key: 'inicio' },
    {
      label: 'Reportes',
      icon: <Assignment />,
      key: 'reportes',
      items: [
        { label: 'Reporte de Actividades', path: '/becario/actividades' },
        { label: 'Reporte de Becas', path: '/becario/becas' }
      ]
    },
    {
      label: 'Documentos',
      icon: <Description />,
      key: 'documentos',
      items: [
        { label: 'Documentos Personales', path: '/becario/documentos-personales' },
        { label: 'Documentos Académicos', path: '/becario/documentos-academicos' }
      ]
    },

    { label: 'Capacitación', icon: <School />, path: '/becario/capacitacion', key: 'capacitacion' },
    { label: 'Historias de éxito', icon: <EmojiEvents />, path: '/becario/historias-exito', key: 'historias' },
  ];

  const isActive = (path: string) => {
    if (path === '/becario') {
      return location.pathname === '/becario' || location.pathname === '/becario/';
    }
    return location.pathname.startsWith(path);
  };

  const isReportActive = () => {
    return location.pathname.startsWith('/becario/actividades') ||
      location.pathname.startsWith('/becario/becas');
  };

  const isDocumentActive = () => {
    return location.pathname.startsWith('/becario/documentos');
  };

  const handleDocumentsClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setDocumentsMenuOpen(!documentsMenuOpen);
    } else {
      event.preventDefault();
      event.stopPropagation();
      setDocumentsMenuAnchor(event.currentTarget);
    }
  };

  const handleDocumentItemClick = (path: string) => {
    navigate(path);
    setDocumentsMenuAnchor(null);
    setDocumentsMenuOpen(false);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleReportsClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setReportsMenuAnchor(reportsMenuAnchor ? null : event.currentTarget);
    } else {
      event.preventDefault();
      event.stopPropagation();
      setReportsMenuAnchor(event.currentTarget);
    }
  };

  const handleReportItemClick = (path: string) => {
    navigate(path);
    setReportsMenuAnchor(null);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuItemClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleProfileClick = () => {
    navigate('/becario/mi-perfil');
    handleUserMenuClose();
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          position: "relative",
          boxShadow: 2,
          borderRadius: 2,
          "&::before": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 1,
            right: 1,
            height: "5px",
            background:
              "linear-gradient(to right, #FFD700 0%, #FFD700 10%, #1E3A8A 10%, #1E3A8A 20%, #26C6DA 20%, #26C6DA 30%, #DC2626 30%, #DC2626 40%, #FFD700 40%, #FFD700 50%, #1E3A8A 50%, #1E3A8A 60%, #26C6DA 60%, #26C6DA 70%, #DC2626 70%, #DC2626 80%, #FFD700 80%, #FFD700 90%, #1E3A8A 90%, #1E3A8A 100%)",
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={unboundLogo}
              alt="UNBOUND"
              sx={{
                height: { xs: 24, sm: 32 },
                mr: { xs: 1, sm: 2 },
                cursor: 'pointer'
              }}
              onClick={() => navigate('/becario')}
            />
            <Typography
              variant="body2"
              sx={{
                color: '#26C6DA',
                fontWeight: 600,
                mr: { xs: 1, sm: 4 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              - Becarios
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: { md: 1, lg: 3 }
          }}>
            {menuItems.map((item) => (
              item.key === 'reportes' ? (
                <Box key={item.key} sx={{ position: 'relative' }}>
                  <Button
                    startIcon={item.icon}
                    onClick={handleReportsClick}
                    sx={{
                      color: isReportActive() ? '#26C6DA' : '#64748b',
                      fontWeight: isReportActive() ? 600 : 400,
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#26C6DA',
                      },
                      textTransform: 'none',
                      px: 2,
                    }}
                    endIcon={<ExpandMore />}
                    id="reports-button"
                  >
                    {item.label}
                  </Button>
                  <Menu
                    open={Boolean(reportsMenuAnchor)}
                    onClose={() => setReportsMenuAnchor(null)}
                    anchorEl={reportsMenuAnchor}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    MenuListProps={{
                      'aria-labelledby': 'reports-button',
                    }}
                  >
                    {item.items?.map((subItem) => (
                      <MenuItem
                        key={subItem.path}
                        onClick={() => handleReportItemClick(subItem.path)}
                        selected={location.pathname === subItem.path}
                      >
                        {subItem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : item.key === 'documentos' ? (
                <Box key={item.key} sx={{ position: 'relative' }}>
                  <Button
                    startIcon={item.icon}
                    onClick={handleDocumentsClick}
                    sx={{
                      color: isDocumentActive() ? '#26C6DA' : '#64748b',
                      fontWeight: isDocumentActive() ? 600 : 400,
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#26C6DA',
                      },
                      textTransform: 'none',
                      px: 2,
                    }}
                    endIcon={<ExpandMore />}
                    id="documents-button"
                  >
                    {item.label}
                  </Button>
                  <Menu
                    open={Boolean(documentsMenuAnchor)}
                    onClose={() => setDocumentsMenuAnchor(null)}
                    anchorEl={documentsMenuAnchor}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    MenuListProps={{
                      'aria-labelledby': 'documents-button',
                    }}
                  >
                    {item.items?.map((subItem) => (
                      <MenuItem
                        key={subItem.path}
                        onClick={() => handleDocumentItemClick(subItem.path)}
                        selected={location.pathname === subItem.path}
                      >
                        {subItem.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <Button
                  key={item.key}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive(item.path) ? '#26C6DA' : '#64748b',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#26C6DA',
                    },
                    textTransform: 'none',
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              )
            ))}
          </Box>

          {/* Mobile & Tablet Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: '#26C6DA',
                width: { xs: 28, sm: 32 },
                height: { xs: 28, sm: 32 },
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#00BCD4',
                  transform: 'scale(1.05)',
                },
              }}
              onClick={handleUserMenuOpen}
              title={`${user?.firstName} ${user?.lastName}`}
            >
              <AccountCircle sx={{ fontSize: { xs: 16, sm: 20 } }} />
            </Avatar>

            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#64748b',
                '&:hover': {
                  color: '#26C6DA',
                  bgcolor: 'rgba(38, 198, 218, 0.08)',
                }
              }}
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ color: '#26C6DA', fontWeight: 600 }}>
            Menú Becario
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            item.key === 'reportes' ? (
              <React.Fragment key={item.key}>
                <ListItemButton
                  onClick={handleReportsClick}
                  sx={{
                    color: isReportActive() ? '#26C6DA' : '#64748b',
                    fontWeight: isReportActive() ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#26C6DA',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {reportsMenuAnchor ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={Boolean(reportsMenuAnchor)} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items?.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        onClick={() => handleReportItemClick(subItem.path)}
                        sx={{
                          pl: 4,
                          color: location.pathname === subItem.path ? '#26C6DA' : '#64748b',
                          fontWeight: location.pathname === subItem.path ? 600 : 400,
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: '#26C6DA',
                          },
                        }}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : item.key === 'documentos' ? (
              <React.Fragment key={item.key}>
                <ListItemButton
                  onClick={handleDocumentsClick}
                  sx={{
                    color: isDocumentActive() ? '#26C6DA' : '#64748b',
                    fontWeight: isDocumentActive() ? 600 : 400,
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: '#26C6DA',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {documentsMenuOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={documentsMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items?.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        onClick={() => handleDocumentItemClick(subItem.path)}
                        sx={{
                          pl: 4,
                          color: location.pathname === subItem.path ? '#26C6DA' : '#64748b',
                          fontWeight: location.pathname === subItem.path ? 600 : 400,
                          '&:hover': {
                            bgcolor: 'transparent',
                            color: '#26C6DA',
                          },
                        }}
                      >
                        <ListItemText primary={subItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ) : (
              <ListItem
                key={item.key}
                button
                onClick={() => handleMobileMenuItemClick(item.path)}
                sx={{
                  color: isActive(item.path) ? '#26C6DA' : '#64748b',
                  fontWeight: isActive(item.path) ? 600 : 400,
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: '#26C6DA',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            )
          ))}
        </List>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            mt: 1,
            minWidth: 180,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {user?.email}
          </Typography>
        </Box>

        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Person sx={{ fontSize: 20, color: '#64748b' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#1e293b' }}>
            Mi Perfil
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout sx={{ fontSize: 20, color: '#dc2626' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ color: '#dc2626' }}>
            Cerrar Sesión
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BecarioHeader;