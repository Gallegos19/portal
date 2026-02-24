import React, { useState } from 'react';
import { Box, Button, IconButton, Modal, Typography, useTheme } from '@mui/material';
import { Close as CloseIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material';
import YouTube from 'react-youtube';

interface CapacitacionesVideoModalProps {
  open: boolean;
  title: string;
  videoId: string;
  onClose: () => void;
}

const CapacitacionesVideoModal: React.FC<CapacitacionesVideoModalProps> = ({
  open,
  title,
  videoId,
  onClose,
}) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
    },
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(4px)',
        },
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[24],
          borderRadius: 2,
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              maxWidth: 'calc(100% - 48px)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <IconButton aria-label="Cerrar" onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 0,
            paddingBottom: '56.25%',
            bgcolor: 'black',
          }}
        >
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
                zIndex: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Cargando video...
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: isLoading ? 0 : 1,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <YouTube
              videoId={videoId}
              opts={opts}
              onReady={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Reproduciendo capacitación
          </Typography>
          <Button variant="outlined" size="small" startIcon={<PlayIcon />}>
            En reproducción
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CapacitacionesVideoModal;