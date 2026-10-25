import { useEffect, useState } from 'react';
import { Menu, X, Hexagon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#game', label: 'Snake' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 32);
      const sections = ['hero', 'about', 'projects', 'skills', 'game', 'contact'];
      const mid = window.scrollY + window.innerHeight * 0.35;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid && el.offsetTop + el.offsetHeight > mid) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'surface-strong shadow-2xl shadow-black/50' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <a href="#hero" className="group flex items-center gap-2.5">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-cyan-300 text-[#07060d] shadow-lg shadow-indigo-500/25 group-hover:rotate-12 transition-transform">
            <Hexagon size={18} />
          </span>
          <span className="font-display text-lg tracking-tight text-indigo-200">Atharva</span>
        </a>

        <ul className="hidden md:flex items-center gap-1 surface rounded-full px-2 py-1.5">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  active === l.href
                    ? 'bg-indigo-500/20 text-indigo-200'
                    : 'text-slate-400 hover:text-indigo-200'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 px-5 py-2 text-sm font-semibold text-[#07060d] btn-brand hover:scale-105 transition-transform shadow-lg shadow-indigo-500/25"
          >
            Let's talk
          </a>

          <button
            className="md:hidden grid h-10 w-10 place-items-center rounded-xl surface text-indigo-300"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden surface-strong border-t border-indigo-500/15">
          <ul className="flex flex-col px-5 py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-3 text-sm font-medium text-slate-300 hover:text-indigo-200 rounded-lg hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
