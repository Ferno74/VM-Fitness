import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// Reusable Copy Overlay Component
const CopyOverlay = ({ scrollYProgress, enter, fullyVisibleStart, fullyVisibleEnd, exit, position, isHero, children }) => {
  const opacity = useTransform(
    scrollYProgress,
    [enter, fullyVisibleStart, fullyVisibleEnd, exit],
    isHero ? [1, 1, 1, 0] : [0, 1, 1, 0],
    { clamp: true }
  );
  
  const y = useTransform(
    scrollYProgress,
    [enter, fullyVisibleStart, fullyVisibleEnd, exit],
    isHero ? [0, 0, 0, -20] : [20, 0, 0, -20],
    { clamp: true }
  );

  // Bulletproof fix: physically hide the element when it is outside its scroll range
  const display = useTransform(scrollYProgress, (currentScroll) => {
    // If we've scrolled past the exit point, hide it completely
    if (currentScroll > exit) return "none";
    // If we haven't reached the enter point (and it's not the hero), hide it
    if (!isHero && currentScroll < enter) return "none";
    // Otherwise, show it as a flex container
    return "flex";
  });

  return (
    <motion.div 
      style={{ opacity, y, display }}
      className={`absolute inset-0 flex-col justify-center px-6 md:px-24 z-20 ${position === 'center' ? 'items-center text-center' : position === 'left' ? 'items-start text-left' : 'items-end text-left md:text-right'}`}
    >
      <div className="max-w-2xl">
        {children}
      </div>
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Background visual subtly scales and dims throughout the 400vh scroll
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.4, 0.1]);

  return (
    <div className="bg-[#09090B] text-[rgba(255,255,255,0.6)] font-sans selection:bg-accent selection:text-white">
      
      {/* =========================================
          SCROLLYTELLING SEQUENCE (400vh)
          ========================================= */}
      <div ref={containerRef} className="h-[400vh] relative w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#09090B]">
          
          {/* Subtle Radial Glow */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_#0a0a0c_0%,_#09090B_70%)] opacity-80 pointer-events-none"></div>

          {/* Unified Void Background - Substitutes the Canvas sequence */}
          <motion.div 
            className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity"
            style={{ 
              scale: bgScale, 
              opacity: bgOpacity,
              backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')", 
              filter: "contrast(1.2) brightness(0.8)"
            }}
          ></motion.div>

          {/* BEAT 1: HERO (0-18%) */}
          <CopyOverlay scrollYProgress={scrollYProgress} enter={0} fullyVisibleStart={0.05} fullyVisibleEnd={0.12} exit={0.18} position="center" isHero={true}>
            <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter mb-4 text-[rgba(255,255,255,0.9)]">
              Strength, perfected.
            </h2>
            <p className="text-[rgba(255,255,255,0.7)] text-2xl md:text-3xl font-medium mb-4">
              Flagship biomechanics, re-engineered for a world that never stops.
            </p>
            <p className="text-[rgba(255,255,255,0.5)] text-sm tracking-wide">
              VM FITNESS ARCHITECTURE
            </p>
          </CopyOverlay>

          {/* BEAT 2: ENGINEERING REVEAL (15-42%) */}
          <CopyOverlay scrollYProgress={scrollYProgress} enter={0.15} fullyVisibleStart={0.22} fullyVisibleEnd={0.35} exit={0.42} position="left">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-[rgba(255,255,255,0.9)]">
              Precision-engineered <br/>for performance.
            </h2>
            <p className="text-[rgba(255,255,255,0.6)] text-xl leading-relaxed">
              Premium iron, optimized biomechanics, and targeted isolation deliver studio-grade results — hour after hour, session after session.
            </p>
          </CopyOverlay>

          {/* BEAT 3: THE TECH (40-67%) */}
          <CopyOverlay scrollYProgress={scrollYProgress} enter={0.40} fullyVisibleStart={0.47} fullyVisibleEnd={0.60} exit={0.67} position="right">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-[rgba(255,255,255,0.9)]">
              Adaptive training, <br/>redefined.
            </h2>
            <ul className="text-[rgba(255,255,255,0.6)] text-xl leading-relaxed space-y-2">
              <li>· Smart QR system tracks every station.</li>
              <li>· Real-time spatial tutorials adjust to your form.</li>
              <li>· Distractions fade away. Your focus stays pure.</li>
            </ul>
          </CopyOverlay>

          {/* BEAT 4: THE AI ENGINE (65-87%) */}
          <CopyOverlay scrollYProgress={scrollYProgress} enter={0.65} fullyVisibleStart={0.70} fullyVisibleEnd={0.80} exit={0.87} position="left">
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 text-[rgba(255,255,255,0.9)]">
              Immersive, intelligent <br/>coaching.
            </h2>
            <p className="text-[rgba(255,255,255,0.6)] text-xl leading-relaxed">
              Our Google Gemini AI unlocks deep insights into your biomechanics. <br/><br/>Algorithmically-enhanced protocols restore progression and clarity to your routine — so every set feels alive.
            </p>
          </CopyOverlay>

          {/* BEAT 5: REASSEMBLY & CTA (84-100%) */}
          <CopyOverlay scrollYProgress={scrollYProgress} enter={0.84} fullyVisibleStart={0.90} fullyVisibleEnd={0.99} exit={1} position="center">
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 text-[rgba(255,255,255,0.9)]">
              Achieve everything. <br/>Settle for nothing.
            </h2>
            <p className="text-[rgba(255,255,255,0.7)] text-2xl font-medium mb-12">
              VM FITNESS. Designed for focus, built for results.
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-6">
                <Link to="/plans" className="px-8 py-3 rounded-full relative group overflow-hidden bg-transparent text-[rgba(255,255,255,0.9)] font-medium">
                  {/* Subtle hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-yellow-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  {/* Gradient Border */}
                  <div className="absolute inset-0 rounded-full border border-transparent [background:linear-gradient(45deg,#09090B,#09090B)_padding-box,linear-gradient(135deg,#FF6B00,#FFA500)_border-box]"></div>
                  <span className="relative z-10">Experience VM Fitness</span>
                </Link>
                <Link to="/equipment" className="text-[rgba(255,255,255,0.6)] hover:text-white transition-colors">
                  See full specs →
                </Link>
              </div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs mt-4">
                Engineered for athletes, beginners, and everything in between.
              </p>
            </div>
          </CopyOverlay>

        </div>
      </div>

      {/* =========================================
          1. FEATURE GRID
          ========================================= */}
      <section className="w-full py-24 bg-[#09090B]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          
          <div className="bg-[#18181B] p-8 rounded-2xl border-t-2 border-t-accent shadow-xl">
            <svg className="w-8 h-8 text-accent mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="text-xl font-bold text-[rgba(255,255,255,0.9)] mb-3">24/7 Access</h3>
            <p className="text-[rgba(255,255,255,0.6)] leading-relaxed">All-day training, even with your most demanding schedule active.</p>
          </div>

          <div className="bg-[#18181B] p-8 rounded-2xl border-t-2 border-t-accent shadow-xl">
            <svg className="w-8 h-8 text-accent mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <h3 className="text-xl font-bold text-[rgba(255,255,255,0.9)] mb-3">Smart Environment</h3>
            <p className="text-[rgba(255,255,255,0.6)] leading-relaxed">Climate-controlled, pure focus. One seamless atmospheric experience.</p>
          </div>

          <div className="bg-[#18181B] p-8 rounded-2xl border-t-2 border-t-accent shadow-xl">
            <svg className="w-8 h-8 text-accent mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
            <h3 className="text-xl font-bold text-[rgba(255,255,255,0.9)] mb-3">AI Ecosystem</h3>
            <p className="text-[rgba(255,255,255,0.6)] leading-relaxed">Your data, biomechanics, and diet perfectly synced the moment you walk in.</p>
          </div>

        </div>
      </section>

      {/* =========================================
          2. SPECS STRIP
          ========================================= */}
      <section className="w-full py-24 bg-[#18181B] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-display font-bold text-[rgba(255,255,255,0.9)] mb-12 uppercase tracking-widest text-center">Technical Specifications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">Facility Size</span>
              <span className="text-[rgba(255,255,255,0.9)]">10,000+ sq ft</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">Equipment</span>
              <span className="text-[rgba(255,255,255,0.9)]">50+ Smart Stations</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">AI Engine</span>
              <span className="text-[rgba(255,255,255,0.9)]">Google Gemini 3.6</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">Access Profile</span>
              <span className="text-[rgba(255,255,255,0.9)]">24/7 RFID Configured</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">Environment</span>
              <span className="text-[rgba(255,255,255,0.9)]">HEPA Filtered Airflow</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-4">
              <span className="text-[rgba(255,255,255,0.5)]">App Support</span>
              <span className="text-[rgba(255,255,255,0.9)]">iOS, Android, Web UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. FINAL CTA SECTION
          ========================================= */}
      <section className="w-full py-32 bg-[#09090B] relative overflow-hidden">
        {/* Subtle radial glow behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent opacity-5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-display font-bold text-[rgba(255,255,255,0.9)] tracking-tight mb-10">
            Ready to feel the difference?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/plans" className="px-10 py-4 rounded-full bg-gradient-to-r from-accent to-yellow-500 text-white font-bold tracking-wide hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(255,107,0,0.3)]">
              Join VM Fitness
            </Link>
            <span className="text-[rgba(255,255,255,0.9)] text-xl font-light">₹999 / month</span>
          </div>
        </div>
      </section>

      {/* =========================================
          4. FOOTER
          ========================================= */}
      <footer className="w-full py-8 bg-[#09090B] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-[rgba(255,255,255,0.3)] text-xs tracking-wider">
          <p>© {new Date().getFullYear()} VM Fitness. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-[rgba(255,255,255,0.6)] transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-[rgba(255,255,255,0.6)] transition-colors">Terms</Link>
            <Link to="#" className="hover:text-[rgba(255,255,255,0.6)] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
