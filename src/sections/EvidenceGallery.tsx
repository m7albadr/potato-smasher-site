import { useRef, useEffect, useState } from "react";

const EVIDENCE = [
  { src: "/IMG_8537.jpg", label: "EXHIBIT A", caption: "The salute that started it all" },
  { src: "/photo2.png", label: "EXHIBIT B", caption: "Fog-staring incident #47" },
  { src: "/photo3.png", label: "EXHIBIT C", caption: "Birthday party infiltration" },
  { src: "/photo4.png", label: "EXHIBIT D", caption: "Illegal wall-leaning" },
];

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, v };
}

function EvidenceCard({ item, index }: { item: typeof EVIDENCE[0]; index: number }) {
  const card = useReveal(0.1);

  return (
    <div
      ref={card.ref}
      style={{
        opacity: card.v ? 1 : 0,
        transform: card.v ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <div className="group relative photo-zoom">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl bg-[#0c0b0a] border border-[#ffffff08] group-hover:border-[#d4a84325] transition-colors duration-500">
          <img src={item.src} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20" />

          <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4">
            <span className="text-[7px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] font-mono text-[#d4a843] bg-[#050505]/70 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-[#d4a84322]">
              {item.label}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-[#f5e6c8] font-display tracking-wide">{item.caption}</p>
          </div>

          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-3 h-3 sm:w-5 sm:h-5 border-t border-r border-[#d4a843] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-5 sm:h-5 border-b border-l border-[#d4a843] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  );
}

export function EvidenceGallery() {
  const h = useReveal(0.3);

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div
          ref={h.ref}
          className="text-center mb-10 sm:mb-16"
          style={{ opacity: h.v ? 1 : 0, transform: h.v ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] text-[#8b6914] font-mono mb-3 sm:mb-4">PHOTOGRAPHIC EVIDENCE</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display text-[#f5e6c8] glow-text-strong">Evidence Vault</h2>
          <div className="hr-glow max-w-[100px] sm:max-w-[140px] mx-auto mt-4 sm:mt-6" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {EVIDENCE.map((item, i) => (
            <EvidenceCard key={i} item={item} index={i} />
          ))}
        </div>

        <p className="text-center text-[8px] sm:text-[9px] tracking-[0.15em] sm:tracking-[0.2em] text-[#2a2520] font-mono mt-6 sm:mt-10">
          EVIDENCE CANNOT BE UNSEEN
        </p>
      </div>
    </section>
  );
}
