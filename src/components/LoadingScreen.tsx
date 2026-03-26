import { useEffect, useState } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + (100 - p) * 0.08 + Math.random() * 2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase(1), 200);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-darker flex items-center justify-center"
      style={{
        opacity: phase === 1 ? 0 : 1,
        transition: "opacity 0.6s ease",
      }}
    >
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-[10px] tracking-[0.5em] text-gold-dim font-mono mb-3">
            BUREAU OF POTATO INVESTIGATION
          </div>
          <div className="text-2xl font-display text-gold glow-text">
            CASE FILE #PSM-2026
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full"
              style={{
                width: `${progress}%`,
                transition: "width 0.05s linear",
                boxShadow: "0 0 10px #d4a84344",
              }}
            />
          </div>
          <div className="mt-3 text-[10px] font-mono text-gold-dim tracking-[0.2em]">
            {progress < 30
              ? "ACCESSING CLASSIFIED FILES..."
              : progress < 60
                ? "DECRYPTING EVIDENCE..."
                : progress < 90
                  ? "LOADING THREAT ASSESSMENT..."
                  : "ACCESS GRANTED"}
          </div>
        </div>
      </div>
    </div>
  );
}
