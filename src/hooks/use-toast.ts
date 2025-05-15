import * as React from "react";
import type { Toast } from "@/components/ui/use-toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type State = {
  toasts: Toast[];
};

const memoryState: State = { toasts: [] };

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  return {
    toasts: state.toasts,
    toast: (props: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setState((prev) => ({
        ...prev,
        toasts: [...prev.toasts, { ...props, id }],
      }));
      return id;
    },
    dismiss: (id: string) => {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.filter((toast) => toast.id !== id),
      }));
    },
  };
}

let toastFn: ((props: Omit<Toast, "id">) => string) | null = null;

export function toast(props: Omit<Toast, "id">) {
  if (!toastFn) {
    const { toast } = useToast();
    toastFn = toast;
  }
  return toastFn(props);
}
