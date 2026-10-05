const SCRAPS = [
  { src: "/pins/29836416278745853/collage-original.jpg", rot: -8 },
  { src: "/pins/51861833204668772/collage-original.jpg", rot: 7 },
  { src: "/pins/14988611255524466/collage-original.jpg", rot: -4 },
  { src: "/pins/23432860626219894/collage-original.jpg", rot: 6 },
  { src: "/pins/278519558201523885/collage-original.jpg", rot: -6 },
  { src: "/pins/1100778333957365068/collage-original.jpg", rot: 5 },
];

export function Polaroid({
  src,
  rot,
  className = "",
}: {
  src: string;
  rot: number;
  className?: string;
}) {
  return (
    <div className={`polaroid ${className}`} style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <img src={src} alt="" loading="lazy" decoding="async" />
      <span className="tape" />
    </div>
  );
}

export function CornerScraps() {
  const pair = [SCRAPS[0], SCRAPS[1]];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 h-24" aria-hidden>
      {pair.map((scrap, index) =>
        scrap ? (
          <div
            key={scrap.src}
            className={`absolute top-0 ${index === 0 ? "-left-8" : "-right-8"} opacity-80`}
          >
            <Polaroid src={scrap.src} rot={scrap.rot} />
          </div>
        ) : null,
      )}
    </div>
  );
}

export function DeskScraps() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block" aria-hidden>
      <div className="absolute left-[4%] top-[12%]">
        <Polaroid src={SCRAPS[2]?.src ?? ""} rot={-8} />
      </div>
      <div className="absolute right-[5%] top-[18%]">
        <Polaroid src={SCRAPS[3]?.src ?? ""} rot={7} />
      </div>
      <div className="absolute bottom-[10%] left-[7%]">
        <Polaroid src={SCRAPS[4]?.src ?? ""} rot={5} />
      </div>
      <div className="absolute right-[8%] bottom-[14%]">
        <Polaroid src={SCRAPS[5]?.src ?? ""} rot={-6} />
      </div>
    </div>
  );
}

export function ScrapRow() {
  return (
    <div className="mt-4 flex justify-center gap-3" aria-hidden>
      {SCRAPS.slice(0, 4).map((scrap) => (
        <Polaroid key={scrap.src} src={scrap.src} rot={scrap.rot} />
      ))}
    </div>
  );
}
