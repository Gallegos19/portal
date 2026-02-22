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
  Divider
} from '@mui/material';
import {
  Assignment,
  People,
  Group,
  CameraAlt,
  Description,
  AccountCircle,
  Menu as MenuIcon,
  Person,
  Logout,
  Event as EventIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import unboundLogo from '../../core/assets/images/unbound-logo.webp';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const menuItems = [
    { label: 'Reportes', icon: <Assignment />, path: '/admin/reportes', key: 'reportes' },
    { label: 'Becarios', icon: <People />, path: '/admin/becarios', key: 'becarios' },
    {
      label: 'Facilitadores',
      icon: <Group />,
      path: '/admin/facilitadores',
      key: 'facilitadores',
    },
    { label: 'Regiones', icon: <Description />, path: '/admin/regiones', key: 'regiones' },
    { label: 'Subprojectos', icon: <CameraAlt />, path: '/admin/subprojectos', key: 'subprojectos' },
    { label: 'Eventos', icon: <EventIcon />, path: '/admin/eventos', key: 'eventos' },
    { label: 'Formatos', icon: <Description />, path: '/admin/formatos', key: 'formatos' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
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
    navigate('/admin/mi-perfil');
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
              onClick={() => navigate('/admin')}
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
              - Administradores
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{
            display: { xs: 'none', lg: 'flex' },
            alignItems: 'center',
            gap: { lg: 1, xl: 3 }
          }}>
            {menuItems.map((item) => (
              <Box key={item.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: isActive(item.path) ? '#26C6DA' : '#64748b',
                    textTransform: 'none',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    transition: 'all 0.2s ease',
                    fontSize: { lg: '0.75rem', xl: '0.875rem' },
                    px: { lg: 1, xl: 2 },
                    '&:hover': {
                      color: '#26C6DA',
                      bgcolor: 'rgba(38, 198, 218, 0.08)',
                    },
                  }}
                >
                  {item.label}
                </Button>
                {item.subtitle && (
                  <Typography variant="caption" sx={{ fontSize: '10px', color: '#64748b', mt: -0.5 }}>
                    {item.subtitle}
                  </Typography>
                )}
              </Box>
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
                display: { xs: 'flex', lg: 'none' },
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
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ color: '#26C6DA', fontWeight: 600 }}>
            Menú Admin
          </Typography>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.key}
              onClick={() => handleMobileMenuItemClick(item.path)}
              sx={{
                cursor: 'pointer',
                bgcolor: isActive(item.path) ? 'rgba(38, 198, 218, 0.08)' : 'transparent',
                '&:hover': {
                  bgcolor: 'rgba(38, 198, 218, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#26C6DA' : '#64748b' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.subtitle}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: isActive(item.path) ? '#26C6DA' : '#64748b',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  },
                  '& .MuiListItemText-secondary': {
                    color: '#64748b',
                    fontSize: '0.75rem',
                  }
                }}
              />
            </ListItem>
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

export default AdminHeader;