import { useCallback, useState } from 'react';
import type { ToastKind } from '../components/Toast';

type ToastState = {
  open: boolean;
  message: string;
  kind: ToastKind;
};

const INITIAL_TOAST: ToastState = {
  open: false,
  message: '',
  kind: 'info',
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>(INITIAL_TOAST);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    setToast({
      open: true,
      message,
      kind,
    });
  }, []);

  const showSuccess = useCallback((message: string) => {
    setToast({
      open: true,
      message,
      kind: 'success',
    });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({
      open: true,
      message,
      kind: 'error',
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  }, []);

  const resetToast = useCallback(() => {
    setToast(INITIAL_TOAST);
  }, []);

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    hideToast,
    resetToast,
  };
}