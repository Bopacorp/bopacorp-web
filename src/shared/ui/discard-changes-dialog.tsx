import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.js';
import { Button } from '@/components/ui/button.js';

interface DiscardChangesDialogProps {
  open: boolean;
  onCancel: () => void;
  onDiscard: () => void;
}

export function DiscardChangesDialog({ open, onCancel, onDiscard }: DiscardChangesDialogProps) {
  const { t } = useTranslation();

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  const handleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDiscard();
  };

  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent onEscapeKeyDown={onCancel}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('common.discardChanges')}</AlertDialogTitle>
          <AlertDialogDescription>{t('common.discardChangesDesc')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t('common.keepEditing')}
          </Button>
          <Button type="button" variant="destructive" onClick={handleDiscard}>
            {t('common.discard')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
