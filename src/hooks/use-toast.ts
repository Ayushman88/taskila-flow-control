
import { useToast as useToastOriginal } from "@/components/ui/use-toast";
import { toast as toastOriginal } from "@/components/ui/use-toast";

export const useToast = useToastOriginal;
export const toast = toastOriginal;

export type { Toast } from "@/components/ui/use-toast";
