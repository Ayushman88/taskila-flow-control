
import { type ToastProps } from "@/components/ui/toast";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useToast as useToastHook, toast as toastFunc } from "@/hooks/use-toast";

export { useToastHook as useToast, toastFunc as toast };

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
