import { useCallback, useEffect, useState } from "react";
import { PageLoader, ErrorState } from "@/shared/ui";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import type { PaginationMeta } from "@bopacorp/shared";
import type { ContentBlockResponse, UpdateContentBlockRequest } from "@bopacorp/shared/catalog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

type ContentBlockListApiResponse = {
  success: true;
  data: ContentBlockResponse[];
  meta: PaginationMeta;
};

type ContentBlockSingleApiResponse = {
  success: true;
  data: ContentBlockResponse;
};

export function CmsPage() {
  const [contentBlocks, setContentBlocks] = useState<ContentBlockResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [page] = useState(1);

  const [editingBlock, setEditingBlock] = useState<ContentBlockResponse | null>(null);
  const [editBody, setEditBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/v1/catalog/content-blocks?page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ContentBlockListApiResponse>;
      })
      .then((json) => {
        if (cancelled) return;
        setContentBlocks(json.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, retryCount]);

  const retry = useCallback(() => {
    setLoading(true);
    setError(null);
    setRetryCount((n) => n + 1);
  }, []);

  const openEdit = useCallback((block: ContentBlockResponse) => {
    setEditingBlock(block);
    setEditBody(block.body ?? "");
  }, []);

  const closeEdit = useCallback(() => {
    setEditingBlock(null);
    setEditBody("");
    setSaving(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingBlock) return;

    setSaving(true);

    try {
      const payload: UpdateContentBlockRequest = { body: editBody };
      const res = await fetch(`/api/v1/catalog/content-blocks/${editingBlock.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = (await res.json()) as ContentBlockSingleApiResponse;

      if (json.success) {
        setContentBlocks((prev) =>
          prev.map((b) => (b.id === editingBlock.id ? json.data : b))
        );
        toast.success("Bloque actualizado");
        closeEdit();
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }, [editingBlock, editBody, closeEdit]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (contentBlocks.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Sin contenido</EmptyTitle>
            <EmptyDescription>
              No hay bloques CMS publicados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background p-6">
      <h2 className="text-2xl font-bold text-foreground">CMS Content Blocks</h2>
      <p className="text-muted-foreground mt-2">{contentBlocks.length} bloques cargados.</p>
      {contentBlocks.map((block) => (
        <div key={block.id} className="border rounded p-4 mt-4">
          <h3 className="text-lg font-semibold">{block.title}</h3>
          <p className="text-sm text-muted-foreground">Tipo: {block.contentType?.name}</p>
          <p className="text-sm text-muted-foreground">Orden: {block.sortOrder}</p>
          <p className="mt-2">{block.body}</p>
          <Separator />
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Publicado el {new Date(block.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">Actualizado el {new Date(block.updatedAt).toLocaleDateString()}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => openEdit(block)}>
              <Pencil data-icon="inline-start" />
              Editar contenido
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={!!editingBlock} onOpenChange={(open) => { if (!open) closeEdit(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar contenido</DialogTitle>
            <DialogDescription>
              {editingBlock?.title || "Bloque CMS"}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="edit-body">Contenido</FieldLabel>
              <Textarea
                id="edit-body"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                rows={8}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={closeEdit} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={saveEdit} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
