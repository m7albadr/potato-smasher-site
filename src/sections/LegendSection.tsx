import { useRef, useEffect, useState } from "react";

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

export function LegendSection() {
  const r = useReveal(0.2);

  return (
    <section className="py-40 md:py-56 px-6 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ opacity: r.v ? 1 : 0, transition: "opacity 2s ease 0.5s" }}>
        <div className="w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, #d4a84308 0%, transparent 65%)" }} />
      </div>

      <div ref={r.ref} className="max-w-3xl mx-auto text-center relative z-10">
        <p className="text-[10px] tracking-[0.5em] text-[#8b6914] font-mono mb-10" style={{ opacity: r.v ? 1 : 0, transition: "opacity 0.8s ease" }}>
          CASE CONCLUSION
        </p>

        <p className="text-xl md:text-2xl text-[#5a5550] font-display mb-4" style={{ opacity: r.v ? 1 : 0, transform: r.v ? "translateY(0)" : "translateY(16px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          Not a Criminal.
        </p>

        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display text-[#d4a843] glow-text-strong" style={{ opacity: r.v ? 1 : 0, transform: r.v ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.6s" }}>
          A Legend.
        </h2>

        <div className="hr-glow max-w-[200px] mx-auto mt-10 mb-10" style={{ opacity: r.v ? 1 : 0, transition: "opacity 1s ease 1.2s" }} />

        <p className="text-sm md:text-base text-[#5a5550] max-w-lg mx-auto leading-relaxed" style={{ opacity: r.v ? 1 : 0, transform: r.v ? "translateY(0)" : "translateY(12px)", transition: "all 0.8s ease 1.4s" }}>
          After extensive investigation, the Bureau has concluded that this individual
          is simply too legendary to be contained. All charges have been upgraded to
          <span className="text-[#d4a843]"> commendations</span>.
        </p>

        {/* Seal */}
        <div className="mt-20 inline-flex flex-col items-center gap-3" style={{ opacity: r.v ? 1 : 0, transform: r.v ? "scale(1)" : "scale(0.8)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 1.8s" }}>
          <div className="w-16 h-16 rounded-full border border-[#d4a84322] flex items-center justify-center">
            <span className="text-2xl">🥔</span>
          </div>
          <p className="text-[8px] tracking-[0.4em] text-[#3a3530] font-mono">BUREAU OF POTATO INVESTIGATION</p>
          <p className="text-[7px] tracking-[0.3em] text-[#2a2520] font-mono">EST. 2026  //  "IN SPUDS WE TRUST"</p>
        </div>
      </div>
    </section>
  );
}
