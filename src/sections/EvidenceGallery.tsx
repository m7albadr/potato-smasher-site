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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={card.ref}
      style={{
        opacity: card.v ? 1 : 0,
        transform: card.v ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <div
        ref={cardRef}
        className="group relative photo-zoom cursor-default"
        style={{
          transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.15s ease-out",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#0c0b0a] border border-[#ffffff08] group-hover:border-[#d4a84325] transition-colors duration-500">
          <img src={item.src} alt={item.caption} className="w-full h-full object-cover" loading="lazy" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20" />

          {/* Glow overlay on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle at 50% 50%, #d4a84310 0%, transparent 70%)" }} />

          {/* Label */}
          <div className="absolute top-4 left-4">
            <span className="text-[9px] tracking-[0.25em] font-mono text-[#d4a843] bg-[#050505]/70 backdrop-blur-sm px-3 py-1 rounded-full border border-[#d4a84322]">
              {item.label}
            </span>
          </div>

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-sm text-[#f5e6c8] font-display tracking-wide">{item.caption}</p>
          </div>

          {/* Corner accents */}
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#d4a843] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[#d4a843] opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
        </div>
      </div>
    </div>
  );
}

export function EvidenceGallery() {
  const h = useReveal(0.3);

  return (
    <section className="py-28 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header — centered */}
        <div
          ref={h.ref}
          className="text-center mb-16"
          style={{ opacity: h.v ? 1 : 0, transform: h.v ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <p className="text-[10px] tracking-[0.5em] text-[#8b6914] font-mono mb-4">PHOTOGRAPHIC EVIDENCE</p>
          <h2 className="text-3xl md:text-5xl font-display text-[#f5e6c8] glow-text-strong">Evidence Vault</h2>
          <div className="hr-glow max-w-[140px] mx-auto mt-6" />
        </div>

        {/* 4-col grid with 3D tilt */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {EVIDENCE.map((item, i) => (
            <EvidenceCard key={i} item={item} index={i} />
          ))}
        </div>

        <p className="text-center text-[9px] tracking-[0.2em] text-[#2a2520] font-mono mt-10">
          EVIDENCE CANNOT BE UNSEEN  //  HOVER TO INSPECT
        </p>
      </div>
    </section>
  );
}
