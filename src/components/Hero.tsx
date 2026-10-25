import { useEffect, useState } from 'react';
import { ArrowDown, Github, Mail, Sparkles } from 'lucide-react';

const ROLES = ['Vibe Coder', 'AI-Assisted Creator', 'Rapid Prototyper', 'CSE @ BITS Pilani'];

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    const full = ROLES[roleIdx];
    let i = 0;
    const typer = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(typer);
        setTimeout(() => setRoleIdx((r) => (r + 1) % ROLES.length), 2400);
      }
    }, 75);
    return () => clearInterval(typer);
  }, [roleIdx]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Coding imagery backdrop */}
      <div
        className="hero-code-img"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
        }}
        aria-hidden
      />
      {/* Neon smoke accent layer */}
      <div
        className="hero-code-img"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/11308972/pexels-photo-11308972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
          opacity: 0.14,
          maskImage: 'radial-gradient(ellipse 60% 50% at 75% 30%, #000 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 75% 30%, #000 0%, transparent 65%)',
        }}
        aria-hidden
      />
      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-24 h-96 w-96 rounded-full bg-indigo-500/15 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-500/12 blur-[140px] animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-teal-400/8 blur-[100px] animate-glow" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 w-full z-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full surface px-4 py-1.5 text-xs font-medium text-indigo-200 animate-glow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400 pulse-dot" />
            </span>
            Open to collaborations
          </span>

          <h1 className="mt-9 font-display text-5xl sm:text-7xl lg:text-[8rem] font-light tracking-tight leading-[0.92]">
            <span className="block text-slate-500 text-base sm:text-xl font-sans font-medium mb-4 tracking-[0.3em] uppercase">
              Hi, I'm
            </span>
            <span className="text-aurora text-glow-aurora">Atharva</span>
          </h1>

          <div className="mt-7 h-9 flex items-center font-mono text-base sm:text-lg">
            <span className="text-slate-600">$&nbsp;</span>
            <span className="text-cyan-300 text-glow-cyan">{typed}</span>
            <span className="cursor-blink text-cyan-300 ml-0.5">▋</span>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-slate-400 leading-relaxed text-base sm:text-lg">
            Turning complex ideas into software — fast. From hand-coded browser games to
            AI-assisted builds, I prototype at the speed of thought.
          </p>

          <div className="mt-11 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 px-7 py-3.5 font-semibold text-[#07060d] shadow-xl shadow-indigo-500/30 hover:shadow-indigo-400/60 hover:scale-[1.04] transition-all"
            >
              <Sparkles size={18} /> Explore Projects
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full hairline px-7 py-3.5 font-semibold text-indigo-200 hover:scale-[1.04] transition-transform"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <a
              href="https://github.com/Atharvajpatil"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full surface hover-lift text-slate-300 hover:text-indigo-300"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:f20260168@hyderabad.bits-pilani.ac.in"
              className="grid h-11 w-11 place-items-center rounded-full surface hover-lift text-slate-300 hover:text-cyan-300"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>

          <a
            href="#about"
            className="mt-16 inline-flex flex-col items-center text-slate-600 hover:text-indigo-300 transition-colors group"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase">Scroll</span>
            <ArrowDown size={16} className="mt-2 animate-bounce group-hover:text-cyan-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
