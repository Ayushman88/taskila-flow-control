import * as React from "react";
import type { Toast } from "@/components/ui/use-toast";

type ToastActionType = (props: Omit<Toast, "id">) => void;

// Create a context for toast functionality
export const ToastContext = React.createContext<{
  toasts: Toast[];
  addToast: ToastActionType;
  dismissToast: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast: ToastActionType = (props) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

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
export const toast = (props: Omit<Toast, "id">) => {
  // Instead of using hooks here, we'll dispatch a custom event
  const event = new CustomEvent("toast", { detail: props });
  window.dispatchEvent(event);
};
