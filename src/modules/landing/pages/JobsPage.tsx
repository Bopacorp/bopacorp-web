import type { ListJobVacanciesQuery } from '@bopacorp/shared/employability';
import { ArrowRight, BriefcaseBusiness, CheckCircle2, Send, Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ApplyJobVacancyResponse, JobVacancyListItemResponse } from '@/modules/employability';
import {
  ApplyDialog,
  ApplySuccessDialog,
  isVacancyClosed,
  usePublicJobVacancy,
  usePublishedVacancies,
  VacanciesEmpty,
  VacanciesSkeleton,
  VacancyCard,
  VacancyDetailPanel,
} from '@/modules/employability';
import { ErrorState } from '@/shared/ui';

const LIST_QUERY: ListJobVacanciesQuery = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function JobsPage() {
  const { vacancies, loading, error, retry } = usePublishedVacancies(LIST_QUERY);
  const [activeVacancyId, setActiveVacancyId] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successResponse, setSuccessResponse] = useState<ApplyJobVacancyResponse | null>(null);

  useEffect(() => {
    if (vacancies.length > 0 && activeVacancyId === null) {
      setActiveVacancyId(vacancies[0].id);
    }
  }, [vacancies, activeVacancyId]);

  const activeListItem = useMemo<JobVacancyListItemResponse | null>(() => {
    if (!activeVacancyId) return null;
    return vacancies.find((vacancy) => vacancy.id === activeVacancyId) ?? null;
  }, [vacancies, activeVacancyId]);

  const {
    vacancy: activeDetail,
    loading: detailLoading,
    error: detailError,
    retry: retryDetail,
  } = usePublicJobVacancy(activeVacancyId);

  const closed = activeListItem ? isVacancyClosed(activeListItem.closingDate) : false;
  const applyVacancyId = activeDetail?.id ?? activeListItem?.id ?? null;
  const applyVacancyTitle = activeDetail?.title ?? activeListItem?.title ?? '';
  const applyVacancy = applyVacancyId ? { id: applyVacancyId, title: applyVacancyTitle } : null;

  const handleSelect = (vacancy: JobVacancyListItemResponse) => {
    setActiveVacancyId(vacancy.id);
  };

  const handleApplySuccess = (response: ApplyJobVacancyResponse) => {
    setApplyOpen(false);
    setSuccessResponse(response);
    setSuccessOpen(true);
  };

  return (
    <div className="w-full bg-background text-foreground">
      <section className="border-b border-border bg-gradient-to-br from-background via-background to-muted/30 px-6 py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <Badge variant="secondary" className="w-fit">
            Trabaja con nosotros
          </Badge>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="flex flex-col gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Postula a una vacante activa o envia tu perfil abierto al equipo de talento.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Revisa la lista de roles disponibles, selecciona la vacante que te interese y envia
                tu postulacion con tu CV en PDF. Tambien puedes escribir al area de RRHH sin
                asociarlo a una vacante concreta.
              </p>
            </div>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="gap-2">
                <CardTitle className="text-base font-semibold">Proceso simple</CardTitle>
                <CardDescription>
                  Selecciona un rol, adjunta tu CV y completa tus datos antes de enviar.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <ProcessStep
                  icon={CheckCircle2}
                  title="1. Elige la vacante"
                  description="Cada rol tiene su aplicacion propia."
                />
                <ProcessStep
                  icon={Upload}
                  title="2. Sube tu PDF"
                  description="El CV es obligatorio para aplicar."
                />
                <ProcessStep
                  icon={Send}
                  title="3. Envio final"
                  description="Tus datos quedan listos para el reclutador."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="size-5 text-primary" />
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Ofertas disponibles</h2>
                <p className="text-sm text-muted-foreground">
                  Selecciona una vacante para ver los detalles y postularte.
                </p>
              </div>
            </div>

            {loading && <VacanciesSkeleton />}

            {!loading && error && (
              <ErrorState message={error.message} code={error.code} onRetry={retry} />
            )}

            {!loading && !error && vacancies.length === 0 && <VacanciesEmpty />}

            {!loading && !error && vacancies.length > 0 && (
              <div className="flex flex-col gap-4">
                {vacancies.map((vacancy) => (
                  <VacancyCard
                    key={vacancy.id}
                    vacancy={vacancy}
                    active={vacancy.id === activeVacancyId}
                    closed={isVacancyClosed(vacancy.closingDate)}
                    onSelect={() => handleSelect(vacancy)}
                  />
                ))}
              </div>
            )}
          </div>

          <VacancyDetailPanel
            vacancy={activeDetail}
            loading={detailLoading}
            error={detailError}
            onRetry={retryDetail}
            onApply={() => setApplyOpen(true)}
            closed={closed}
          />
        </div>
      </section>

      <section className="border-t border-border bg-muted/20 px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-4">
            <Badge variant="secondary" className="w-fit">
              Contacto general
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight">Formulario directo con RRHH</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Este formulario es independiente de las vacantes y sirve para consultas generales,
              referencias, alianzas o preguntas del proceso de talento.
            </p>
          </div>

          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </section>

      <ApplyDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        vacancy={applyVacancy}
        onSuccess={handleApplySuccess}
      />
      {successResponse && (
        <ApplySuccessDialog
          open={successOpen}
          onOpenChange={setSuccessOpen}
          response={successResponse}
        />
      )}
    </div>
  );
}

function ProcessStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CheckCircle2;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
      <Icon className="size-5 text-primary" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState({ fullName: '', email: '', phone: '', message: '' });

  return (
    <>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contact-name">Nombre completo</FieldLabel>
          <Input
            id="contact-name"
            value={values.fullName}
            onChange={(event) =>
              setValues((current) => ({ ...current, fullName: event.target.value }))
            }
            placeholder="Tu nombre"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-email">Correo electronico</FieldLabel>
          <Input
            id="contact-email"
            type="email"
            value={values.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
            placeholder="tu@email.com"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-phone">Numero de contacto</FieldLabel>
          <Input
            id="contact-phone"
            type="tel"
            value={values.phone}
            onChange={(event) =>
              setValues((current) => ({ ...current, phone: event.target.value }))
            }
            placeholder="+593 ..."
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">Mensaje</FieldLabel>
          <Textarea
            id="contact-message"
            rows={5}
            value={values.message}
            onChange={(event) =>
              setValues((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="Escribe tu consulta para RRHH"
          />
          <FieldDescription>Te responderemos por correo electronico.</FieldDescription>
        </Field>
      </FieldGroup>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button">
          <Send data-icon="inline-start" />
          Enviar mensaje
        </Button>
        <Button type="button" variant="outline">
          <ArrowRight data-icon="inline-end" />
          Escribir a RRHH
        </Button>
      </div>
    </>
  );
}
