import { BlueprintGrid } from '../components/decor.js';

export default function TermsPage() {
  return (
    <div className="w-full flex flex-col font-sans bg-background min-h-screen">
      {/* Hero Header Section */}
      <div className="relative w-full overflow-hidden bg-hero text-white border-b border-border/50 py-16 md:py-20">
        <BlueprintGrid className="text-white/5 mask-fade-top" />
        <div className="relative mx-auto max-w-4xl px-6 text-center flex flex-col gap-4">
          <span className="text-xs font-semibold tracking-wider text-primary uppercase">Legal</span>
          <h1 className="font-brand text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Última actualización: 21 de junio de 2026. Por favor, lea atentamente los términos que
            regulan el uso de nuestro sitio web.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <section className="w-full bg-background px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">1. Información General</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El presente sitio web es operado por <strong>BOPACORP S.A.</strong>, una sociedad
              legalmente constituida en la República del Ecuador, con domicilio principal en el
              Edificio Elite piso 3 oficina 308, Calle Luis Orrantia, Guayaquil, Ecuador.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP opera en calidad de distribuidor oficial autorizado de <strong>Tigo</strong>,
              ofreciendo soluciones integrales de telecomunicaciones para el sector empresarial en
              el territorio ecuatoriano.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">2. Aceptación de los Términos</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Al acceder, navegar o utilizar este sitio web, usted reconoce que ha leído,
              comprendido y acepta estar obligado por estos Términos y Condiciones, así como por
              todas las leyes y regulaciones aplicables en Ecuador. Si no está de acuerdo con alguno
              de estos términos, le solicitamos abstenerse de utilizar este sitio.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              3. Uso del Sitio Web y Servicios
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              El sitio web tiene como propósito principal brindar información sobre las soluciones
              corporativas de voz, datos, conectividad y servicios digitales de Tigo distribuidos
              por BOPACORP, así como facilitar el contacto con asesores comerciales y la postulación
              a vacantes de empleo.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Usted se compromete a hacer uso de este sitio de manera lícita, respetando la moral,
              las buenas costumbres y el orden público. Queda estrictamente prohibido cualquier uso
              del sitio con fines fraudulentos, perjudiciales o para enviar información falsa.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">4. Propiedad Intelectual</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Todos los contenidos de este sitio, incluyendo de forma enunciativa pero no
              limitativa: textos, gráficos, logotipos, marcas comerciales de BOPACORP y de Tigo
              (bajo licencia o derechos de distribución correspondientes), interfaces, códigos de
              programación e imágenes, son propiedad exclusiva de sus respectivos dueños y están
              protegidos por las leyes de propiedad intelectual vigentes en Ecuador y tratados
              internacionales.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP realiza sus mejores esfuerzos para mantener la información de este sitio
              actualizada y exacta. No obstante, no garantiza la total ausencia de errores
              tipográficos u omisiones temporales sobre precios, especificaciones de planes
              corporativos o disponibilidad de equipos.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP no se responsabiliza por daños derivados del uso o la imposibilidad de uso
              del sitio web, incluyendo fallas de conexión o la presencia de software malicioso
              provocado por terceros ajenos a la administración del servidor.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">6. Enlaces a Terceros</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Este sitio web puede incluir enlaces a páginas de terceros, como el portal oficial de
              Tigo o pasarelas de pago externas. Estos enlaces se proporcionan únicamente para
              conveniencia del usuario. BOPACORP no controla ni se hace responsable por el
              contenido, políticas de privacidad o prácticas de dichos sitios web externos.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">7. Modificaciones</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              BOPACORP se reserva el derecho de modificar o actualizar estos Términos y Condiciones
              en cualquier momento sin previo aviso. Las modificaciones serán efectivas
              inmediatamente después de su publicación en el sitio web. El uso continuo del sitio
              tras la publicación de los cambios constituye la aceptación de los mismos.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-foreground">
              8. Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Cualquier controversia relacionada con el uso de este sitio web o la interpretación de
              estos términos se regirá por las leyes de la República del Ecuador. Para la resolución
              de conflictos, las partes se someten expresamente a la jurisdicción de los jueces y
              tribunales de la ciudad de Guayaquil, Ecuador.
            </p>
          </div>

          <div className="flex flex-col gap-4 border-t border-border pt-6">
            <h2 className="text-lg font-semibold text-foreground">Contacto comercial</h2>
            <p className="text-sm text-muted-foreground">
              Si tiene dudas sobre estos términos, contáctenos en{' '}
              <a href="mailto:contacto@bopacorp.com" className="text-primary hover:underline">
                contacto@bopacorp.com
              </a>{' '}
              o llámenos al <span className="font-mono">0912345678</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
