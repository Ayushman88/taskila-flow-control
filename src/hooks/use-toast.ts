
import * as React from "react";
import type { Toast, ToastActionElement } from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// Create a context for toast functionality
export const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (props: Omit<ToasterToast, "id">) => void;
  dismissToast: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const addToast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id }]);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Custom hook to use toast functionality
export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    toasts: context.toasts,
    toast: context.addToast,
    dismiss: context.dismissToast,
  };
}

// Helper function to show toasts
export const toast = (props: Omit<ToasterToast, "id">) => {
  // Instead of using hooks here, we'll dispatch a custom event
  const event = new CustomEvent("toast", { detail: props });
  window.dispatchEvent(event);
};
