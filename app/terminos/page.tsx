import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Verzus',
  description: 'Términos y condiciones de compra en la tienda en línea de Verzus.',
};

export default function TerminosPage() {
  return (
    <main className="flex-1 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-black">Términos y Condiciones</span>
        </nav>

        <h1
          className="text-4xl sm:text-5xl text-black mb-12 leading-tight"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Términos y Condiciones
        </h1>

        <div className="flex flex-col gap-8 text-sm text-gray-600 leading-relaxed">

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">1. Aceptación</h2>
            <p>
              Al realizar una compra en <strong className="text-black">verzus.co</strong>, el cliente acepta
              los presentes términos y condiciones. Verzus se reserva el derecho de modificarlos en cualquier
              momento, publicando la versión actualizada en este sitio web.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">2. Productos y precios</h2>
            <p>
              Todos los precios publicados están expresados en pesos colombianos (COP) e incluyen IVA cuando
              aplique. Verzus se reserva el derecho de modificar los precios sin previo aviso. El precio
              vigente al momento de confirmar tu pedido es el que se aplicará a tu compra.
            </p>
            <p className="mt-3">
              Las imágenes de los productos son ilustrativas. Los colores reales pueden variar ligeramente
              según la calibración de tu pantalla.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">3. Proceso de compra</h2>
            <p>
              El proceso de compra se realiza a través de los canales disponibles en nuestra tienda en línea.
              Una vez confirmado el pago, recibirás un mensaje de confirmación con los detalles de tu pedido.
              La confirmación de pago no garantiza disponibilidad inmediata; en caso de agotarse el stock,
              te contactaremos en las siguientes 24 horas hábiles.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">4. Métodos de pago</h2>
            <p>
              Aceptamos pagos mediante tarjeta de crédito, débito y PSE a través de las pasarelas de pago
              habilitadas. Todos los datos de pago son procesados de forma segura por nuestro proveedor de
              pagos y Verzus no almacena información financiera de los clientes.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">5. Envíos</h2>
            <p>
              Realizamos envíos a todo el territorio colombiano. Los tiempos de entrega estimados son:
            </p>
            <ul className="list-disc list-inside flex flex-col gap-1.5 mt-3 ml-1">
              <li><strong className="text-black">Bogotá y área metropolitana:</strong> 1 a 3 días hábiles</li>
              <li><strong className="text-black">Ciudades principales:</strong> 2 a 5 días hábiles</li>
              <li><strong className="text-black">Municipios y zonas rurales:</strong> 5 a 10 días hábiles</li>
            </ul>
            <p className="mt-3">
              Los tiempos de entrega son estimados y pueden variar por factores externos (festivos, condiciones
              climáticas, situaciones de orden público). El costo de envío se calcula según el destino y el
              peso del pedido.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">6. Cambios y devoluciones</h2>
            <p>
              Las condiciones de cambios y devoluciones se rigen por nuestra{' '}
              <Link href="/politicas" className="text-black underline hover:opacity-70 transition-opacity">
                Política de Cambios y Devoluciones
              </Link>
              {' '}y por el Estatuto del Consumidor colombiano (Ley 1480 de 2011).
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">7. Propiedad intelectual</h2>
            <p>
              Todos los diseños, fotografías, textos, logos y demás contenidos publicados en verzus.co son
              propiedad exclusiva de Verzus o de sus respectivos titulares. Queda prohibida su reproducción,
              distribución o uso comercial sin autorización expresa por escrito.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">8. Limitación de responsabilidad</h2>
            <p>
              Verzus no se hace responsable por daños indirectos, incidentales o consecuentes derivados del
              uso de los productos adquiridos, salvo en los casos previstos por la Ley 1480 de 2011.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">9. Ley aplicable</h2>
            <p>
              Los presentes términos se rigen por las leyes de la República de Colombia. Cualquier
              controversia derivada de los mismos será resuelta de conformidad con la legislación colombiana
              vigente y, en caso de disputas, ante los jueces competentes de Colombia.
            </p>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-widest text-black font-semibold mb-3">10. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, escríbenos a{' '}
              <a href="mailto:hola@verzus.co" className="text-black underline">hola@verzus.co</a>
              {' '}o por WhatsApp al <strong className="text-black">+57 300 434 0482</strong>.
            </p>
          </div>

        </div>

        <div className="text-xs text-gray-400 border-t border-gray-100 pt-6 mt-12">
          Última actualización: junio de 2025 ·{' '}
          <Link href="/politicas" className="hover:text-black transition-colors underline">
            Ver Políticas de Cambios y Datos
          </Link>
        </div>
      </div>
    </main>
  );
}
