
// Re-export from hooks folder to avoid circular imports
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useToast, toast } from "@/hooks/use-toast";

export { useToast, toast };
export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>;
export type ToastActionElement = React.ReactElement<typeof ToastPrimitive.Action>;

export interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
}
