import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isOpen,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#F4F6A6]" />,
    error: <XCircle className="w-4 h-4 text-[#C6283D]" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#18181B] border border-white/10 text-[#F5F5F0] px-4 py-3 rounded-lg shadow-xl text-sm animate-in fade-in slide-in-from-bottom-5">
      {icons[type]}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-[#A1A1AA] hover:text-[#F5F5F0] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
