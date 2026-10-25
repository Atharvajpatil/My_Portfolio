import { Hexagon, Mail, Github, Instagram, Heart, ArrowUp } from 'lucide-react';

const EMAIL = 'f20260168@hyderabad.bits-pilani.ac.in';
const GITHUB = 'https://github.com/Atharvajpatil';
const INSTAGRAM = 'https://instagram.com/atharva.102030';

export default function Footer() {
  return (
    <footer className="relative border-t border-indigo-500/15 py-12 px-5 z-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-[#07060d]">
              <Hexagon size={16} />
            </span>
            <span className="font-display text-base text-indigo-200">Atharva</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${EMAIL}`}
              className="grid h-10 w-10 place-items-center rounded-full surface hover-lift text-indigo-300"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full surface hover-lift text-cyan-300"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 w-10 place-items-center rounded-full surface hover-lift text-fuchsia-300"
              aria-label="Instagram"
            >
              <Instagram size={16} />
            </a>
          </div>

          <a
            href="#hero"
            className="group inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-indigo-300 transition-colors"
          >
            back to top
            <span className="grid h-8 w-8 place-items-center rounded-lg surface group-hover:scale-110 transition-transform">
              <ArrowUp size={14} />
            </span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600 inline-flex items-center gap-1.5">
            Built with <Heart size={11} className="text-indigo-400 fill-indigo-400" /> &amp; vibe
            coding
          </p>
          <p className="text-xs text-slate-600 font-mono">
            © {new Date().getFullYear()} Atharva · BITS Pilani Hyderabad
          </p>
        </div>
      </div>
    </footer>
  );
}
