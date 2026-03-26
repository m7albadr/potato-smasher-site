import { useRef, useEffect, useState } from "react";

const CHARGES = [
  { id: "PSM-001", charge: "UNAUTHORIZED SALUTING", detail: "Subject believes he's in the military. Has been observed saluting cashiers, bus drivers, and his own reflection.", severity: "EXTREME", color: "#8b0000" },
  { id: "PSM-002", charge: "EXCESSIVE MAIN CHARACTER ENERGY", detail: "Was caught staring dramatically into the fog on multiple occasions. Witnesses report cinematic wind appearing from nowhere.", severity: "CRITICAL", color: "#d4a843" },
  { id: "PSM-003", charge: "IDENTITY FRAUD", detail: "Pretending to be a Marine at a birthday party. Children were impressed. Adults were concerned.", severity: "HIGH", color: "#cc5500" },
  { id: "PSM-004", charge: "ILLEGAL MODELING WITHOUT A LICENSE", detail: "Spotted posing against walls in public areas. Security footage shows at least 47 different angles attempted.", severity: "MAXIMUM", color: "#8b0000" },
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

export function ChargesSection() {
  const h = useReveal(0.3);

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={h.ref}
          className="text-center mb-10 sm:mb-16"
          style={{ opacity: h.v ? 1 : 0, transform: h.v ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] text-[#8b6914] font-mono mb-3 sm:mb-4">OFFICIAL CHARGES</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display text-[#f5e6c8] glow-text-strong">Criminal Record</h2>
          <div className="hr-glow max-w-[100px] sm:max-w-[140px] mx-auto mt-4 sm:mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {CHARGES.map((c, i) => {
            const card = useReveal(0.15);
            return (
              <div
                key={c.id}
                ref={card.ref}
                className="card-3d group"
                style={{
                  opacity: card.v ? 1 : 0,
                  transform: card.v ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                }}
              >
                <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" style={{ background: `linear-gradient(135deg, ${c.color}33, transparent, ${c.color}18)` }} />
                <div className="relative bg-[#0c0b0a] border border-[#ffffff08] rounded-xl p-5 sm:p-6 md:p-7 hover:border-[#d4a84320] transition-colors duration-500">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-[#3a3530] font-mono">#{c.id}</span>
                    <span className="text-[7px] sm:text-[8px] tracking-[0.15em] font-mono px-2 sm:px-2.5 py-0.5 rounded-full border" style={{ color: c.color, borderColor: c.color + "33", background: c.color + "0a" }}>
                      {c.severity}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg text-[#f5e6c8] font-display tracking-wide mb-2 sm:mb-3 glow-text">{c.charge}</h3>
                  <p className="text-[12px] sm:text-[13px] text-[#5a5550] leading-relaxed">{c.detail}</p>
                  <div className="mt-4 sm:mt-5 h-[1px] bg-gradient-to-r from-[#d4a84315] via-[#d4a84308] to-transparent" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
