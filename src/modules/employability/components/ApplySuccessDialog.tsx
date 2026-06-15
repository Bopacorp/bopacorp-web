import { Briefcase, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import type { ApplyJobVacancyResponse } from '../employability.types.js';

interface ApplySuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  response: ApplyJobVacancyResponse;
}

export function ApplySuccessDialog({ open, onOpenChange, response }: ApplySuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
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
          <DialogTitle>Postulacion enviada</DialogTitle>
          <DialogDescription>
            Recibimos tu postulacion para la vacante. Te contactaremos por correo electronico.
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Briefcase className="size-4 text-muted-foreground" />
            <span className="font-medium">{response.vacancy.title}</span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">Candidato:</span>{' '}
              {response.candidate.firstName} {response.candidate.lastName}
            </span>
            {response.appliedAt && (
              <span>
                <span className="font-medium text-foreground">Enviada:</span>{' '}
                {new Date(response.appliedAt).toLocaleString('es-EC')}
              </span>
            )}
            <span>
              <span className="font-medium text-foreground">Estado:</span> {response.state}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
