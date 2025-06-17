
import { toast } from '@/hooks/use-toast';

/**
 * Zobrazí toast s chybovou hláškou
 */
export function showErrorToast(message: string) {
  toast({
    title: "Chyba generování plánu",
    description: message,
    variant: "destructive",
  });
}
