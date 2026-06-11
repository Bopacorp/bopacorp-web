import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleAlert,
  FileText,
  Mail,
  MapPin,
  Phone,
  Send,
  Upload,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type JobOpening = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  seniority: string;
  summary: string;
  highlights: string[];
};

const jobOpenings: JobOpening[] = [
  {
    id: 'field-sales',
    title: 'Asesor Comercial Corporativo',
    department: 'Ventas',
    location: 'Guayaquil, Ecuador',
    type: 'Presencial',
    seniority: 'Senior',
    summary:
      'Gestiona oportunidades B2B, acompaña prospectos y convierte reuniones en propuestas claras.',
    highlights: ['Clientes corporativos', 'Seguimiento comercial', 'Cierre consultivo'],
  },
  {
    id: 'customer-success',
    title: 'Customer Success Specialist',
    department: 'Operaciones',
    location: 'Remoto LATAM',
    type: 'Híbrido',
    seniority: 'Semi Senior',
    summary: 'Da soporte a cuentas activas y coordina resoluciones con el equipo interno.',
    highlights: ['Soporte postventa', 'Gestión de cuentas', 'Coordinación interna'],
  },
  {
    id: 'talent-coordinator',
    title: 'Coordinador de Talento',
    department: 'Recursos Humanos',
    location: 'Guayaquil, Ecuador',
    type: 'Presencial',
    seniority: 'Semi Senior',
    summary: 'Centraliza postulación, entrevista y seguimiento de candidatos para roles activos.',
    highlights: ['Screening', 'Entrevistas', 'Seguimiento de candidatos'],
  },
];

const contactChannels = [
  {
    label: 'Talento Humano',
    value: 'hr@bopacorp.com',
    note: 'Atención para postulaciones generales y dudas del proceso.',
    icon: Mail,
  },
  {
    label: 'Llamadas',
    value: '+593 4 000 0000',
    note: 'Horario de atención: lunes a viernes, 09:00 a 17:00.',
    icon: Phone,
  },
  {
    label: 'Sede principal',
    value: 'Guayaquil, Ecuador',
    note: 'Recepción y entrevistas presenciales.',
    icon: MapPin,
  },
];

function formatFileName(fileName: string) {
  if (fileName.length <= 32) {
    return fileName;
  }

  return `${fileName.slice(0, 29)}...`;
}

export default function JobsPage() {
  const [activeJobId, setActiveJobId] = useState(jobOpenings[0].id);
  const [resumeName, setResumeName] = useState('');
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleInterest: jobOpenings[0].title,
    message: '',
  });
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });

  const activeJob = useMemo(
    () => jobOpenings.find((job) => job.id === activeJobId) ?? jobOpenings[0],
    [activeJobId],
  );

  const handleSelectJob = (job: JobOpening) => {
    setActiveJobId(job.id);
    setApplicationForm((previous) => ({ ...previous, roleInterest: job.title }));
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeName('');
      return;
    }

    if (file.type !== 'application/pdf') {
      event.target.value = '';
      setResumeName('');
      return;
    }

    setResumeName(file.name);
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
                Postula a una vacante activa o envía tu perfil abierto al equipo de talento.
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                La página está pensada para que primero revises la lista de roles disponibles, luego
                completes tu postulación con datos de contacto y tu CV en PDF, y al final puedas
                escribir al área de RRHH sin asociarlo a una vacante concreta.
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
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <CheckCircle2 className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">1. Elige la vacante</p>
                    <p className="text-xs text-muted-foreground">
                      Cada rol tiene su aplicación propia.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <Upload className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">2. Sube tu PDF</p>
                    <p className="text-xs text-muted-foreground">
                      El CV es obligatorio para aplicar.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                  <Send className="size-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">3. Envío final</p>
                    <p className="text-xs text-muted-foreground">
                      Tus datos quedan listos para el reclutador.
                    </p>
                  </div>
                </div>
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
                  Selecciona una vacante para cargar su formulario.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {jobOpenings.map((job) => {
                const isActive = job.id === activeJobId;

                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => handleSelectJob(job)}
                    className={cn(
                      'rounded-2xl border p-5 text-left transition-colors',
                      isActive
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border bg-card hover:border-primary/30 hover:bg-muted/30',
                    )}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={isActive ? 'default' : 'secondary'}>{job.seniority}</Badge>
                        <Badge variant="outline">{job.department}</Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold tracking-tight">{job.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {job.summary}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Building2 className="size-3.5" />
                          {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {job.location}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.highlights.map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="rounded-full">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm text-muted-foreground">
                          Aplicación directa disponible
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                          Aplicar ahora
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader className="gap-3 border-b border-border pb-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{activeJob.seniority}</Badge>
                <Badge variant="secondary">{activeJob.department}</Badge>
                <Badge variant="outline">{activeJob.type}</Badge>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                {activeJob.title}
              </CardTitle>
              <CardDescription className="max-w-2xl leading-relaxed">
                {activeJob.summary}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-8 p-6">
              <section className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-5">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-primary" />
                  <h3 className="text-base font-semibold">Datos de la postulación</h3>
                </div>

                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="role-interest">Vacante seleccionada</FieldLabel>
                    <Input
                      id="role-interest"
                      value={applicationForm.roleInterest}
                      onChange={(event) =>
                        setApplicationForm((previous) => ({
                          ...previous,
                          roleInterest: event.target.value,
                        }))
                      }
                    />
                    <FieldDescription>
                      Puedes cambiar el texto si deseas ajustar tu interés antes de enviar.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="applicant-name">Nombre completo</FieldLabel>
                    <Input
                      id="applicant-name"
                      value={applicationForm.fullName}
                      onChange={(event) =>
                        setApplicationForm((previous) => ({
                          ...previous,
                          fullName: event.target.value,
                        }))
                      }
                      placeholder="Tu nombre"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="applicant-email">Correo electrónico</FieldLabel>
                    <Input
                      id="applicant-email"
                      type="email"
                      value={applicationForm.email}
                      onChange={(event) =>
                        setApplicationForm((previous) => ({
                          ...previous,
                          email: event.target.value,
                        }))
                      }
                      placeholder="tu@email.com"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="applicant-phone">Número de contacto</FieldLabel>
                    <Input
                      id="applicant-phone"
                      type="tel"
                      value={applicationForm.phone}
                      onChange={(event) =>
                        setApplicationForm((previous) => ({
                          ...previous,
                          phone: event.target.value,
                        }))
                      }
                      placeholder="+593 ..."
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="resume">Subir CV en PDF</FieldLabel>
                    <Input
                      id="resume"
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeChange}
                    />
                    <FieldDescription>
                      El archivo debe estar en formato PDF.{' '}
                      {resumeName
                        ? `Archivo cargado: ${formatFileName(resumeName)}`
                        : 'Aún no has cargado un archivo.'}
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="applicant-message">Mensaje breve</FieldLabel>
                    <Textarea
                      id="applicant-message"
                      rows={4}
                      value={applicationForm.message}
                      onChange={(event) =>
                        setApplicationForm((previous) => ({
                          ...previous,
                          message: event.target.value,
                        }))
                      }
                      placeholder="Cuéntanos por qué te interesa este rol"
                    />
                  </Field>
                </FieldGroup>

                <div className="flex flex-wrap gap-3">
                  <Button type="button">
                    <Upload data-icon="inline-start" />
                    Enviar aplicación
                  </Button>
                  <Button type="button" variant="outline">
                    <CircleAlert data-icon="inline-start" />
                    Revisar requisitos
                  </Button>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-3">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <div
                      key={channel.label}
                      className="rounded-2xl border border-border bg-muted/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{channel.label}</p>
                          <p className="text-sm text-foreground">{channel.value}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{channel.note}</p>
                    </div>
                  );
                })}
              </section>
            </CardContent>
          </Card>
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
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="contact-name">Nombre completo</FieldLabel>
                  <Input
                    id="contact-name"
                    value={contactForm.fullName}
                    onChange={(event) =>
                      setContactForm((previous) => ({
                        ...previous,
                        fullName: event.target.value,
                      }))
                    }
                    placeholder="Tu nombre"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-email">Correo electrónico</FieldLabel>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(event) =>
                      setContactForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    placeholder="tu@email.com"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-phone">Número de contacto</FieldLabel>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={contactForm.phone}
                    onChange={(event) =>
                      setContactForm((previous) => ({
                        ...previous,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="+593 ..."
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="contact-message">Mensaje</FieldLabel>
                  <Textarea
                    id="contact-message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(event) =>
                      setContactForm((previous) => ({
                        ...previous,
                        message: event.target.value,
                      }))
                    }
                    placeholder="Escribe tu consulta para RRHH"
                  />
                </Field>
              </FieldGroup>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button type="button">
                  <Send data-icon="inline-start" />
                  Enviar mensaje
                </Button>
                <Button type="button" variant="outline">
                  <Mail data-icon="inline-start" />
                  Escribir a RRHH
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
