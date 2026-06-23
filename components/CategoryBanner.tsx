import Image from 'next/image';

interface Props {
  imageSrc?: string;
  categoryName: string;
}

export default function CategoryBanner({ imageSrc, categoryName }: Props) {
  return (
    <div className="relative w-full h-52 sm:h-64 lg:h-72 overflow-hidden bg-black">
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={categoryName}
          fill
          className="object-cover object-center opacity-55 scale-[1.03]"
          sizes="100vw"
          unoptimized={imageSrc.startsWith('http')}
        />
      )}

      {/* Gradiente sutil para dar profundidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

      {/* Texto centrado */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center gap-2 px-4">
        <p className="text-[9px] uppercase tracking-[0.35em] text-white/50 font-semibold">
          ✦ Verzus
        </p>
        <h3
          className="text-3xl sm:text-4xl lg:text-5xl text-white leading-tight"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          {categoryName}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 mt-1">
          Nueva colección
        </p>
      </div>
    </div>
  );
}
