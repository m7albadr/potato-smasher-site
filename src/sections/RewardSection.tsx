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

export function RewardSection() {
  const h = useReveal(0.2);
  const warn = useReveal(0.3);
  const card = useReveal(0.15);

  return (
    <section className="py-28 md:py-40 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header — centered */}
        <div
          ref={h.ref}
          className="text-center mb-16"
          style={{ opacity: h.v ? 1 : 0, transform: h.v ? "translateY(0)" : "translateY(24px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        >
          <p className="text-[10px] tracking-[0.5em] text-[#8b6914] font-mono mb-4">REWARD INFORMATION</p>
          <h2 className="text-3xl md:text-5xl font-display text-[#f5e6c8] glow-text-strong">Reward for Capture</h2>
          <div className="hr-glow max-w-[140px] mx-auto mt-6" />
        </div>

        {/* Warning */}
        <div
          ref={warn.ref}
          className="text-center mb-12"
          style={{ opacity: warn.v ? 1 : 0, transform: warn.v ? "scale(1)" : "scale(0.96)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s" }}
        >
          <div className="inline-block border border-[#8b000033] bg-[#8b000008] rounded-lg px-7 py-3.5">
            <p className="text-[#8b0000] text-sm tracking-[0.2em] font-mono animate-pulse">DO NOT APPROACH</p>
            <p className="text-[#5a5550] text-xs mt-1.5">Subject may attempt to salute you or strike a dramatic pose</p>
          </div>
        </div>

        {/* Reward card */}
        <div
          ref={card.ref}
          style={{ opacity: card.v ? 1 : 0, transform: card.v ? "translateY(0)" : "translateY(30px)", transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s" }}
        >
          {/* Outer glow */}
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-b from-[#d4a8430a] via-[#d4a84305] to-transparent rounded-2xl blur-xl" />

            <div className="relative bg-gradient-to-b from-[#0e0d0c] to-[#0a0a09] border border-[#d4a84322] rounded-2xl p-8 md:p-12">
              {/* Decorative line */}
              <div className="flex items-center gap-4 mb-10">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#d4a84322]" />
                <span className="text-[9px] tracking-[0.3em] text-[#3a3530] font-mono">OFFICIAL REWARD</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#d4a84322]" />
              </div>

              {/* Amount */}
              <div className="text-center mb-10">
                <h3 className="text-4xl md:text-6xl font-display text-[#d4a843] glow-text-strong leading-tight">
                  ONE SHAWARMA
                </h3>
                <p className="text-xs text-[#5a5550] mt-3 italic">* extra garlic sauce not included</p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { label: "SIDE OPTIONS", main: "Fries or Hummus", note: "not both, we're not made of money" },
                  { label: "DRINK", main: "One (1) Ayran", note: "no substitutions, non-negotiable" },
                  { label: "BONUS", main: "Extra Napkins", note: "subject is a known messy eater" },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-[#080807] border border-[#ffffff06] rounded-lg text-center md:text-left">
                    <p className="text-[8px] tracking-[0.2em] text-[#3a3530] font-mono mb-2">{item.label}</p>
                    <p className="text-sm text-[#f5e6c8]">{item.main}</p>
                    <p className="text-[11px] text-[#3a3530] mt-1">* {item.note}</p>
                  </div>
                ))}
              </div>

              {/* BPI stamp */}
              <div className="mt-10 flex justify-center">
                <div className="border border-[#d4a84322] rounded-full px-7 py-2.5 rotate-[-1deg]">
                  <span className="text-[#8b6914] text-[9px] tracking-[0.3em] font-mono">BUREAU OF POTATO INVESTIGATION</span>
                </div>
              </div>

              {/* Corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#d4a84322]" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#d4a84322]" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#d4a84322]" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#d4a84322]" />
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] tracking-[0.2em] text-[#2a2520]/60 font-mono mt-10">
          THIS MESSAGE WILL SELF-DESTRUCT IN... JUST KIDDING
        </p>
      </div>
    </section>
  );
}
