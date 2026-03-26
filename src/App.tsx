import { useState, useCallback, useEffect } from "react";
import { HeroScene } from "./components/HeroScene";
import { LoadingScreen } from "./components/LoadingScreen";
import { ChargesSection } from "./sections/ChargesSection";
import { EvidenceGallery } from "./sections/EvidenceGallery";
import { ThreatDashboard } from "./sections/ThreatDashboard";
import { RewardSection } from "./sections/RewardSection";
import { LegendSection } from "./sections/LegendSection";

function Divider() {
  return <div className="hr-glow mx-6 sm:mx-8 md:mx-20 lg:mx-40" />;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("hero-text-overlay");
      if (!el) return;
      const fade = 1 - Math.min(1, window.scrollY / (window.innerHeight * 0.4));
      el.style.opacity = String(Math.max(0, fade));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {!loaded && <LoadingScreen onComplete={handleLoaded} />}

      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
        <div className="grain-overlay" />

        <HeroScene />

        <div className="relative z-10">
          {/* Nav */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-10 py-3 sm:py-4 flex items-center justify-between bg-[#050505]/90 border-b border-[#ffffff06]">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm">🥔</span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.25em] text-[#8b6914] font-mono">BPI CASE FILE</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              {["charges", "evidence", "analysis", "reward"].map((id) => (
                <a key={id} href={`#${id}`} className="text-[9px] tracking-[0.15em] text-[#4a4540] hover:text-[#d4a843] transition-colors duration-300 font-mono uppercase">
                  {id}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8b0000] animate-pulse" />
              <span className="text-[7px] sm:text-[8px] tracking-[0.15em] text-[#8b0000] font-mono">LIVE</span>
            </div>
          </nav>

          {/* Hero spacer */}
          <section className="h-screen flex items-end justify-center pb-10 sm:pb-12 pointer-events-none">
            <div className="flex flex-col items-center gap-2 opacity-40">
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-[#8b6914] font-mono">
                Scroll to investigate
              </span>
              <div className="w-[1px] h-5 sm:h-6 bg-gradient-to-b from-[#d4a843] to-transparent animate-pulse" />
            </div>
          </section>

          {/* Content — 3D peeks through gaps */}
          <div className="bg-[#050505]">
            <Divider />
            <div id="charges"><ChargesSection /></div>
          </div>

          <div className="h-[20vh] sm:h-[30vh] md:h-[40vh]" />

          <div className="bg-[#050505]">
            <Divider />
            <div id="evidence"><EvidenceGallery /></div>
          </div>

          <div className="h-[20vh] sm:h-[30vh] md:h-[40vh]" />

          <div className="bg-[#050505]">
            <Divider />
            <div id="analysis"><ThreatDashboard /></div>
          </div>

          <div className="h-[20vh] sm:h-[30vh] md:h-[40vh]" />

          <div className="bg-[#050505]">
            <Divider />
            <div id="reward"><RewardSection /></div>
          </div>

          <div className="h-[20vh] sm:h-[30vh] md:h-[40vh]" />

          <div className="bg-[#050505]">
            <Divider />
            <LegendSection />
            <footer className="py-8 sm:py-10 text-center border-t border-[#ffffff06]">
              <p className="text-[7px] sm:text-[8px] tracking-[0.3em] sm:tracking-[0.35em] text-[#2a2520] font-mono leading-loose px-4">
                BUREAU OF POTATO INVESTIGATION // ALL RIGHTS RESERVED<br />
                CASE FILE #PSM-2026-0042 // CLASSIFICATION: LEGENDARY
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
