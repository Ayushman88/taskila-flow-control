
import { toast as sonnerToast } from "sonner";

// Re-export toast from sonner for consistency
export const toast = sonnerToast;

// Provide a useToast hook for compatibility with existing code
export const useToast = () => {
  return {
    toast: sonnerToast,
    // Empty toasts array for compatibility with existing toaster component
    toasts: [],
    // No-op function for compatibility
    dismiss: () => {},
  };
};

// Export types for compatibility
export type Toast = {
  id?: string;
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export type ToastActionElement = React.ReactNode;
