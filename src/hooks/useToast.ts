import React from 'react';
import type { AlertColor } from '@mui/material';

export interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const initialToastState: ToastState = {
  open: false,
  message: '',
  severity: 'success'
};

export const useToast = () => {
  const [toast, setToast] = React.useState<ToastState>(initialToastState);

  const showToast = React.useCallback((message: string, severity: AlertColor = 'success') => {
    setToast({
      open: true,
      message,
      severity
    });
  }, []);

  const closeToast = React.useCallback((reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast((current) => ({
      ...current,
      open: false
    }));
  }, []);

  return {
    toast,
    showToast,
    closeToast
  };
};
