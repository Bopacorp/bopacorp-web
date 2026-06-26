import { BlueprintGrid } from '../components/decor.js';
import { useCmsLanding } from '../hooks/use-cms-landing.js';

export default function PrivacyPage() {
  const { blocks } = useCmsLanding();
  const email = blocks?.['site.contact.email']?.body ?? 'contacto@bopacorp.com';
  return (
    <div className="w-full flex flex-col font-sans bg-background min-h-screen">
      {/* Hero Header Section */}
      <div className="relative w-full overflow-hidden bg-hero text-white border-b border-border/50 py-16 md:py-20">
        <BlueprintGrid className="text-white/5 mask-fade-top" />
        <div className="relative mx-auto max-w-4xl px-6 text-center flex flex-col gap-4">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Legal</span>
          <h1 className="font-brand text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Políticas de Privacidad
          </h1>
          <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Última actualización: 21 de junio de 2026. Su privacidad es de suma importancia para
            nosotros. Conozca cómo protegemos y tratamos sus datos personales.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="w-full bg-background px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              1. Responsable del Tratamiento
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El responsable del tratamiento de sus datos personales recolectados a través de este
              portal es <strong>BOPACORP S.A.</strong>, con dirección en Edificio Elite piso 3
              oficina 308, Calle Luis Orrantia, Guayaquil, Ecuador.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Para cualquier consulta sobre la protección de sus datos personales, puede escribirnos
              al correo electrónico:{' '}
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              2. Datos Personales Recopilados
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A través de nuestro sitio web, <strong>BOPACORP</strong> puede recopilar la siguiente
              información:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground flex flex-col gap-2">
              <li>
                <strong>Formularios de Contacto</strong>: Nombre completo, dirección de correo
                electrónico, número de teléfono de contacto, nombre de la empresa y detalles sobre
                el requerimiento comercial de telecomunicaciones.
              </li>
              <li>
                <strong>Módulo de Empleabilidad (Trabaja con Nosotros)</strong>: Nombre completo,
                número de identificación (cédula/RUC), correo electrónico, teléfono, ciudad de
                residencia, historial profesional y de estudios, y el documento de currículum vitae
                (CV) cargado en formato PDF.
              </li>
              <li>
                <strong>Datos de Navegación</strong>: Dirección IP, tipo de navegador, páginas de
                referencia y cookies para analíticas de rendimiento del sitio web.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. Finalidad del Tratamiento de Datos
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tratamos sus datos personales con las siguientes finalidades:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground flex flex-col gap-2">
              <li>
                Gestionar y dar respuesta a sus solicitudes de información sobre planes corporativos
                de voz, datos y conectividad empresarial de Tigo.
              </li>
              <li>
                Evaluar su perfil profesional para vacantes vigentes o futuras dentro de{' '}
                <strong>BOPACORP</strong>
                cuando se postule a través del módulo de empleabilidad.
              </li>
              <li>
                Cumplir con las obligaciones legales y regulatorias aplicables a los distribuidores
                de servicios de telecomunicaciones en el Ecuador.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              4. Base Legal para el Tratamiento
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              La base legal para el tratamiento de sus datos es:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground flex flex-col gap-2">
              <li>
                <strong>Su consentimiento explícito</strong>: Otorgado al enviar los formularios de
                contacto y postulación laboral.
              </li>
              <li>
                <strong>Relación precontractual/contractual</strong>: En el caso de solicitudes de
                cotización comercial para empresas interesadas en contratar servicios.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. Plazo de Conservación de Datos
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Los datos personales se conservarán únicamente durante el tiempo necesario para
              cumplir con las finalidades para las que fueron recopilados, o bien hasta que usted
              revoque su consentimiento o solicite la eliminación de sus datos, conforme a la ley.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              En el caso de los currículums (CV), se mantendrán por un período máximo de 1 año en
              nuestras bases de selección de talento antes de ser destruidos de forma segura.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              6. Derechos del Usuario (LOPDP Ecuador)
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              De acuerdo con la Ley Orgánica de Protección de Datos Personales (LOPDP) de la
              República del Ecuador, usted dispone de los derechos de:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground flex flex-col gap-2">
              <li>
                <strong>Acceso</strong>: Conocer qué datos personales suyos poseemos y cómo los
                tratamos.
              </li>
              <li>
                <strong>Rectificación y Actualización</strong>: Solicitar la corrección de datos
                inexactos o desactualizados.
              </li>
              <li>
                <strong>Eliminación (Cancelación)</strong>: Solicitar el borrado de sus datos cuando
                ya no sean necesarios para los fines que fueron recolectados.
              </li>
              <li>
                <strong>Oposición</strong>: Oponerse al uso de sus datos para finalidades
                específicas.
              </li>
              <li>
                <strong>Portabilidad</strong>: Solicitar sus datos en un formato estructurado y de
                uso común.
              </li>
            </ul>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Para ejercer cualquiera de estos derechos, puede remitir una solicitud escrita firmada
              adjuntando copia de su documento de identidad a{' '}
              <a href={`mailto:${email}`} className="text-primary hover:underline">
                {email}
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              7. Seguridad de la Información
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP implementa medidas técnicas, físicas y organizativas apropiadas para proteger
              sus datos personales contra el acceso no autorizado, alteración, pérdida, destrucción
              o divulgación. Las transmisiones en este sitio web se encuentran encriptadas
              utilizando protocolos seguros de transferencia de hipertexto (HTTPS).
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Modificaciones a la Política
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP se reserva el derecho de modificar esta Política de Privacidad para adaptarla
              a novedades legislativas o jurisprudenciales. Cualquier cambio relevante será
              oportunamente publicado en este sitio web.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
