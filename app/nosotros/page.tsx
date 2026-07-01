import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nuestra historia — Verzus',
  description: 'Conoce la historia detrás de Verzus, marca colombiana de ropa diseñada para gente como tú.',
  alternates: { canonical: '/nosotros' },
};

export default function NosotrosPage() {
  return (
    <main className="flex-1 bg-white">

      {/* Hero editorial */}
      <section className="bg-black text-white py-28 px-6 text-center">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
            ✦ La marca
          </p>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-normal italic leading-[1.05] text-white"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Diseñado para moverte.
          </h1>
          <p
            className="text-3xl sm:text-4xl font-normal italic leading-tight text-white/60"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Hecho para acompañarte.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <div className="flex flex-col gap-10">

          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
              ✦ Nuestro origen
            </p>
            <h2
              className="text-3xl sm:text-4xl text-black font-normal"
              style={{ fontFamily: 'var(--font-dm-serif)' }}
            >
              Nacimos en Colombia
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              Verzus nació de una idea simple: crear ropa que puedas usar para todo. Para entrenar, para salir, para vivir. Ropa que no tiene que elegir entre rendimiento y estilo porque las dos cosas no son opuestas.
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              Somos una marca colombiana. Diseñamos aquí, pensamos en las personas de aquí, y enviamos a todo el país. Cada prenda pasa por un proceso de selección de materiales y una revisión de calidad antes de llegar a tus manos.
            </p>
          </div>

          <div className="w-full h-px" style={{ backgroundColor: 'var(--warm-200)' }} />

          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
              ✦ Lo que nos importa
            </p>
            <h2
              className="text-3xl sm:text-4xl text-black font-normal"
              style={{ fontFamily: 'var(--font-dm-serif)' }}
            >
              Calidad sobre cantidad
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">
              No lanzamos colecciones masivas. Lanzamos piezas que pensamos, que probamos, que perfeccionamos. Preferimos tener menos productos y que cada uno valga la pena.
            </p>
            <p className="text-base text-gray-500 leading-relaxed">
              Usamos materiales que duran, cortes que se adaptan al cuerpo real, y colores que no se van con el primer lavado. Eso es lo que entendemos por premium.
            </p>
          </div>

          <div className="w-full h-px" style={{ backgroundColor: 'var(--warm-200)' }} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-4">
            {[
              { number: '100%', label: 'Diseño colombiano' },
              { number: '24h', label: 'Despacho en un día hábil' },
              { number: '30', label: 'Días para cambios' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-2 text-center sm:text-left">
                <span
                  className="text-5xl text-black font-normal"
                  style={{ fontFamily: 'var(--font-dm-serif)' }}
                >
                  {item.number}
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center border-t" style={{ borderColor: 'var(--warm-border)', backgroundColor: 'var(--warm-50)' }}>
        <div className="max-w-md mx-auto flex flex-col gap-6">
          <p
            className="text-2xl sm:text-3xl text-black font-normal italic"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            ¿Lista para conocer la colección?
          </p>
          <Link
            href="/coleccion"
            className="inline-block border-2 border-black text-black text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-200 w-fit mx-auto"
          >
            Ver colección completa
          </Link>
        </div>
      </section>

    </main>
  );
}
