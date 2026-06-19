import { createContext, useCallback, useContext, useState } from 'react';
import { ContactRequestDialog } from './components/ContactRequestDialog.js';
import { ContactSuccessDialog } from './components/ContactSuccessDialog.js';
import type { ContactRequestResponse } from './contact.types.js';

interface ContactDialogContextValue {
  openContactDialog: (itemId?: string) => void;
}

const ContactDialogContext = createContext<ContactDialogContextValue | null>(null);

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) throw new Error('useContactDialog must be used within ContactDialogProvider');
  return ctx;
}

export function ContactDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState<string | undefined>();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successResponse, setSuccessResponse] = useState<ContactRequestResponse | null>(null);

  const openContactDialog = useCallback((id?: string) => {
    setItemId(id);
    setOpen(true);
  }, []);

  const handleSuccess = useCallback((response: ContactRequestResponse) => {
    setOpen(false);
    setSuccessResponse(response);
    setSuccessOpen(true);
  }, []);

  return (
    <ContactDialogContext value={{ openContactDialog }}>
      {children}
      <ContactRequestDialog
        open={open}
        onOpenChange={setOpen}
        itemId={itemId}
        onSuccess={handleSuccess}
      />
      {successResponse && (
        <ContactSuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          response={successResponse}
        />
      )}
    </ContactDialogContext>
  );
}
