import * as ToastPrimitive from "@radix-ui/react-toast";

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}

export type ToastActionElement = React.ReactElement<
  typeof ToastPrimitive.Action
>;

const toasts: Toast[] = []; // Example array of toasts

export function useToast() {
  return {
    toasts,
  };
}

export { useToast as toast };
