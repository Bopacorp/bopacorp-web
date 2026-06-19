import { CheckCircle2, Mail, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { ContactRequestResponse } from '../contact.types.js';

interface ContactSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: ContactRequestResponse;
}

export function ContactSuccessDialog({ open, onOpenChange, response }: ContactSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
            <CheckCircle2 className="size-6" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
          >
            <X />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <DialogTitle className="font-brand text-lg font-semibold tracking-tight">
            Solicitud enviada
          </DialogTitle>
          <DialogDescription>
            Recibimos tu solicitud. Un asesor comercial te contactara pronto al correo
            proporcionado.
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4 text-primary" />
            <span className="font-semibold">{response.clientName}</span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {response.clientEmail}
            </span>
            {response.createdAt && (
              <span>
                <span className="font-medium text-foreground">Enviada:</span>{' '}
                {new Date(response.createdAt).toLocaleString('es-EC')}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-md px-6 text-sm font-medium"
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
