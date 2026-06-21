import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.js';

interface DiscardChangesDialogProps {
  open: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

export function DiscardChangesDialog({ open, onCancel, onDiscard }: DiscardChangesDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent onEscapeKeyDown={onCancel}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
          <AlertDialogDescription>Los cambios no guardados se perderán.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Seguir editando</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDiscard}>
            Descartar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
