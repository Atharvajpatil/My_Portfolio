import { useState } from 'react';
import {
  Github,
  X,
  FolderGit2,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import { SectionHeading } from './About';

interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  tags: string[];
  icon: typeof Sparkles;
  accent: string;
  glow: string;
  category: 'all' | 'shipped' | 'concept';
  link?: string;
  linkLabel?: string;
  externalNote?: string;
}

const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Vibe Portfolio Website',
    tagline: 'This competition entry, built with AI assistance.',
    description:
      'A portfolio crafted through vibe coding — design direction by me, scaffolding and polish accelerated with AI.',
    longDescription:
      'This very site. A single-page React portfolio with an obsidian aurora theme, glassmorphism cards, an animated gradient hero, and an interactive AI prompt simulator. I directed the design language and feature set; AI assistance handled rapid scaffolding, refactors, and polish. The result is a portfolio that is both a showcase and a working demo of how I build today.',
    tags: ['React', 'TypeScript', 'Tailwind', 'AI-Assisted'],
    icon: Sparkles,
    accent: 'from-indigo-400 to-cyan-300',
    glow: 'shadow-indigo-500/30',
    category: 'shipped',
  },
  {
    id: 'p2',
    title: 'Project Vault on GitHub',
    tagline: 'Explore my builds — including the Infinite Runner — on my GitHub.',
    description:
      'A collection of my hand-coded experiments and projects. The classic Infinite Runner game lives here, built from scratch with pure JavaScript and zero AI.',
    longDescription:
      'Instead of locking my work behind a single card, I keep my projects out in the open on GitHub. Head there to explore the Infinite Runner game (pure JavaScript, zero AI, built from scratch), plus other experiments and builds. Star anything you like — feedback is always welcome.',
    tags: ['GitHub', 'Open Source', 'JavaScript'],
    icon: FolderGit2,
    accent: 'from-cyan-300 to-teal-300',
    glow: 'shadow-cyan-500/30',
    category: 'shipped',
    link: 'https://github.com/Atharvajpatil',
    linkLabel: 'Explore this project on my GitHub',
    externalNote: 'Opens my GitHub profile in a new tab.',
  },
];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'concept', label: 'Concepts' },
] as const;

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<'all' | 'shipped' | 'concept'>('all');

  const filtered = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

  return (
    <section id="projects" className="relative py-32 px-5 z-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading index="02" title="Featured Projects" kicker="what I've built" />

        <div className="mt-8 flex gap-2 fade-up">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === f.id
                  ? 'bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 text-indigo-200 border border-indigo-400/40'
                  : 'surface text-slate-400 hover:text-indigo-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className={`group text-left hairline p-7 hover-lift fade-up`}
              style={{ animationDelay: `${0.08 * i}s` }}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${p.accent} text-[#07060d] shadow-lg ${p.glow} group-hover:scale-110 group-hover:rotate-6 transition-transform`}
                >
                  <p.icon size={22} />
                </span>
                <span className="font-mono text-[11px] text-slate-600">
                  {p.category === 'concept' ? 'CONCEPT' : 'LIVE'}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-display font-medium text-slate-100 group-hover:text-indigo-300 transition-colors">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{p.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-slate-400 border border-white/10 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-300 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                View details <ArrowUpRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md fade-up"
      onClick={onClose}
    >
      <div
        className="surface-strong rounded-3xl max-w-lg w-full p-8 relative border border-indigo-500/25 shadow-2xl shadow-indigo-500/15"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <span
          className={`inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${project.accent} text-[#07060d] shadow-lg ${project.glow}`}
        >
          <project.icon size={26} />
        </span>

        <h3 className="mt-6 text-2xl font-display font-medium text-slate-100">{project.title}</h3>
        <p className="mt-1.5 text-sm text-indigo-300 font-mono">{project.tagline}</p>

        <p className="mt-6 text-slate-300 leading-relaxed text-sm">
          {project.longDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-200 border border-indigo-500/25 font-mono"
            >
              {t}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300 px-6 py-3 font-semibold text-[#07060d] hover:scale-[1.03] transition-transform shadow-lg shadow-indigo-500/25"
          >
            <Github size={18} /> {project.linkLabel}
            <ExternalLink size={14} className="opacity-70" />
          </a>
        )}
        {project.externalNote && (
          <p className="mt-3 text-xs text-slate-500">{project.externalNote}</p>
        )}
      </div>
    </div>
  );
}
