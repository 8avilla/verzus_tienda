import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-white py-32 px-6 text-center">

      <div className="flex flex-col items-center gap-8 max-w-md">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold">
          ✦ Error 404
        </p>

        <h1
          className="text-6xl sm:text-7xl text-black font-normal italic leading-none"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Página no encontrada
        </h1>

        <p className="text-sm text-gray-400 leading-relaxed">
          Parece que te perdiste. La página que buscas no existe o fue movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/"
            className="border-2 border-black text-black text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-black hover:text-white transition-all duration-200"
          >
            Ir al inicio
          </Link>
          <Link
            href="/coleccion"
            className="border border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:border-black hover:text-black transition-all duration-200"
          >
            Ver colección
          </Link>
        </div>

        <a
          href={`https://wa.me/573004340482?text=${encodeURIComponent('Hola Verzus, no encuentro lo que busco en la tienda.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-black transition-colors underline underline-offset-4"
        >
          ¿Necesitas ayuda? Escríbenos por WhatsApp →
        </a>
      </div>

    </main>
  );
}
