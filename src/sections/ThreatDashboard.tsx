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

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1800, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function Meter({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const { ref, v } = useReveal(0.3);
  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.1em] text-[#5a5550] font-mono">{label}</span>
        <span className="text-[10px] sm:text-[11px] font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-[3px] bg-[#141210] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{
          width: v ? `${value}%` : "0%",
          background: `linear-gradient(90deg, ${color}44, ${color})`,
          boxShadow: `0 0 8px ${color}33`,
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }} />
      </div>
    </div>
  );
}

export function ThreatDashboard() {
  const h = useReveal(0.3);
  const stats = useReveal(0.2);
  const meters = useReveal(0.15);

  return (
    <section className="py-20 sm:py-28 md:py-40 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div
          ref={h.ref}
          className="text-center mb-10 sm:mb-16"
          style={{ opacity: h.v ? 1 : 0, transform: h.v ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] text-[#8b6914] font-mono mb-3 sm:mb-4">THREAT ASSESSMENT</p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-display text-[#f5e6c8] glow-text-strong">Subject Analysis</h2>
          <div className="hr-glow max-w-[100px] sm:max-w-[140px] mx-auto mt-4 sm:mt-6" />
        </div>

        <div
          ref={stats.ref}
          className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 mb-6 sm:mb-8"
          style={{ opacity: stats.v ? 1 : 0, transform: stats.v ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          {[
            { label: "DRAMATIC POSES", value: 2847 },
            { label: "SALUTES / MONTH", value: 142 },
            { label: "WALLS LEANED ON", value: 891, suffix: "+" },
          ].map((s, i) => (
            <div
              key={i}
              className="card-3d p-3 sm:p-5 md:p-7 bg-[#0c0b0a] border border-[#ffffff08] rounded-lg sm:rounded-xl text-center"
              style={{
                opacity: stats.v ? 1 : 0,
                transform: stats.v ? "translateY(0)" : "translateY(12px)",
                transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
              }}
            >
              <div className="text-xl sm:text-2xl md:text-4xl font-mono text-[#f5e6c8] glow-text mb-1.5 sm:mb-3">
                <Counter end={s.value} suffix={s.suffix} />
              </div>
              <div className="text-[7px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.15em] text-[#5a5550] font-mono">{s.label}</div>
            </div>
          ))}
        </div>

        <div
          ref={meters.ref}
          className="bg-[#0c0b0a] border border-[#ffffff08] rounded-lg sm:rounded-xl p-5 sm:p-7 md:p-9 space-y-4 sm:space-y-5"
          style={{ opacity: meters.v ? 1 : 0, transform: meters.v ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s" }}
        >
          <p className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.3em] text-[#3a3530] font-mono text-center mb-4 sm:mb-6">BEHAVIORAL ANALYSIS MATRIX</p>
          {[
            { label: "MAIN CHARACTER ENERGY", value: 98, color: "#8b0000" },
            { label: "DRAMATIC EFFECT RADIUS", value: 87, color: "#d4a843" },
            { label: "SHAWARMA DEPENDENCY", value: 100, color: "#cc5500" },
            { label: "MILITARY COSPLAY INDEX", value: 73, color: "#d4a843" },
            { label: "WALL-LEANING FREQUENCY", value: 91, color: "#8b0000" },
            { label: "FOG ATTRACTION LEVEL", value: 65, color: "#8b6914" },
          ].map((m, i) => (
            <Meter key={m.label} {...m} delay={0.2 + i * 0.1} />
          ))}
        </div>

        <div className="mt-8 sm:mt-12 flex justify-center">
          <div className="border border-[#8b000044] rounded px-4 sm:px-5 py-1 sm:py-1.5 rotate-[-2deg]">
            <span className="text-[#8b0000] text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] font-mono">TOP SECRET // BPI EYES ONLY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
