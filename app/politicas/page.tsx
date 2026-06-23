import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Políticas de Cambios y Devoluciones — Verzus',
  description: 'Conoce nuestras políticas de cambios, devoluciones y tratamiento de datos personales en Verzus.',
};

export default function PoliticasPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-black">Políticas</span>
        </nav>

        <h1
          className="text-4xl sm:text-5xl text-black mb-12 leading-tight"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Políticas
        </h1>

        {/* Cambios y Devoluciones */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-black uppercase tracking-widest mb-6">
            Cambios y Devoluciones
          </h2>

          <div className="flex flex-col gap-6 text-sm text-gray-600 leading-relaxed">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Derecho de retracto</h3>
              <p>
                De acuerdo con el Estatuto del Consumidor colombiano (Ley 1480 de 2011, artículo 47),
                tienes derecho a retractarte de tu compra dentro de los <strong className="text-black">5 días hábiles</strong> siguientes
                a la entrega del producto, sin necesidad de expresar causa alguna.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Cambios por talla</h3>
              <p>
                Aceptamos cambios de talla dentro de los <strong className="text-black">15 días calendario</strong> posteriores
                a la recepción del pedido. El producto debe estar sin usar, con etiquetas originales y en su empaque
                original. Los gastos de envío para el cambio corren por cuenta del cliente.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Productos defectuosos</h3>
              <p>
                Si recibes un producto con defecto de fabricación, cuentas con una garantía de
                <strong className="text-black"> 12 meses</strong> desde la fecha de entrega. En este caso,
                los gastos de envío son cubiertos por Verzus.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Exclusiones</h3>
              <p>
                No aplican cambios ni devoluciones en productos marcados como
                <strong className="text-black"> liquidación o edición limitada</strong>, ni en productos que hayan sido
                usados, lavados, o que no conserven sus etiquetas originales.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Proceso</h3>
              <ol className="list-decimal list-inside flex flex-col gap-1.5 ml-1">
                <li>Escríbenos por WhatsApp al <strong className="text-black">+57 300 434 0482</strong> indicando tu número de pedido y el motivo del cambio.</li>
                <li>Te confirmaremos la viabilidad del cambio en un plazo de 24 horas hábiles.</li>
                <li>Envía el producto al lugar que te indicaremos. Guarda el comprobante de envío.</li>
                <li>Una vez recibido e inspeccionado el producto, procesamos el cambio o reembolso en un plazo de 5 a 10 días hábiles.</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
              Para más información sobre tus derechos como consumidor, visita{' '}
              <a
                href="https://www.sic.gov.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline"
              >
                www.sic.gov.co
              </a>{' '}
              (Superintendencia de Industria y Comercio).
            </div>
          </div>
        </section>

        <hr className="border-gray-100 mb-14" />

        {/* Tratamiento de Datos */}
        <section className="mb-14">
          <h2 className="text-lg font-semibold text-black uppercase tracking-widest mb-6">
            Tratamiento de Datos Personales
          </h2>

          <div className="flex flex-col gap-6 text-sm text-gray-600 leading-relaxed">
            <p>
              En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos
              personales en Colombia, <strong className="text-black">Verzus</strong> informa su política de
              tratamiento de datos personales.
            </p>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Responsable del tratamiento</h3>
              <p>
                Verzus, con correo de contacto{' '}
                <a href="mailto:hola@verzus.co" className="text-black underline">hola@verzus.co</a>
                {' '}y canal de atención WhatsApp <strong className="text-black">+57 300 434 0482</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Datos que recopilamos</h3>
              <ul className="list-disc list-inside flex flex-col gap-1 ml-1">
                <li>Nombre completo</li>
                <li>Dirección de entrega</li>
                <li>Número de teléfono</li>
                <li>Correo electrónico</li>
                <li>Información de navegación (cookies de sesión y analítica)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Finalidad del tratamiento</h3>
              <ul className="list-disc list-inside flex flex-col gap-1 ml-1">
                <li>Procesamiento y envío de pedidos</li>
                <li>Atención al cliente y soporte posventa</li>
                <li>Envío de comunicaciones comerciales (solo con tu autorización expresa)</li>
                <li>Mejora de la experiencia de usuario en nuestra tienda</li>
                <li>Cumplimiento de obligaciones legales y fiscales</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Tus derechos (Habeas Data)</h3>
              <p>
                Tienes derecho a conocer, actualizar, rectificar y suprimir tus datos personales, así como
                a revocar la autorización de tratamiento. Para ejercer estos derechos, escríbenos a{' '}
                <a href="mailto:hola@verzus.co" className="text-black underline">hola@verzus.co</a>.
                Responderemos en un plazo máximo de <strong className="text-black">10 días hábiles</strong>.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Transferencia de datos</h3>
              <p>
                Tus datos pueden ser compartidos con empresas de logística y mensajería para la entrega
                de tus pedidos, y con plataformas de pago para el procesamiento de transacciones. No
                vendemos ni compartimos tus datos con terceros para fines publicitarios.
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-2">Vigencia</h3>
              <p>
                Conservamos tus datos personales durante el tiempo necesario para cumplir con las
                finalidades descritas y las obligaciones legales aplicables.
              </p>
            </div>
          </div>
        </section>

        <div className="text-xs text-gray-400 border-t border-gray-100 pt-6">
          Última actualización: junio de 2025 ·{' '}
          <Link href="/terminos" className="hover:text-black transition-colors underline">
            Ver Términos y Condiciones
          </Link>
        </div>
      </div>
    </main>
  );
}
