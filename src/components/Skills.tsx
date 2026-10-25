import { useEffect, useRef, useState } from 'react';
import { Code2, BrainCircuit, LayoutTemplate, Palette } from 'lucide-react';
import { SectionHeading } from './About';

interface Skill {
  name: string;
  level: number;
  icon: typeof Code2;
  color: string;
  tag: string;
}

const SKILLS: Skill[] = [
  { name: 'JavaScript Fundamentals', level: 90, icon: Code2, color: 'from-indigo-400 to-cyan-300', tag: 'core' },
  { name: 'AI Prompting', level: 85, icon: BrainCircuit, color: 'from-cyan-300 to-teal-300', tag: 'craft' },
  { name: 'Web Prototyping', level: 88, icon: LayoutTemplate, color: 'from-indigo-300 to-teal-300', tag: 'speed' },
  { name: 'UI/UX Design', level: 78, icon: Palette, color: 'from-fuchsia-400 to-indigo-300', tag: 'feel' },
];

const MARQUEE = [
  'JavaScript',
  'TypeScript',
  'React',
  'Tailwind',
  'Supabase',
  'AI Prompting',
  'Canvas',
  'Vite',
  'Node.js',
  'UI/UX',
];

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 px-5 z-10">
      {/* Iridescent strip accent */}
      <div
        className="absolute top-20 right-0 h-64 w-64 opacity-20 bg-cover bg-center rounded-full blur-2xl pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/2612938/pexels-photo-2612938.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
        }}
        aria-hidden
      />
      <div className="mx-auto max-w-5xl relative">
        <SectionHeading index="03" title="Skills" kicker="what I bring" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SKILLS.map((s, i) => (
            <SkillCard key={s.name} skill={s} delay={i * 0.1} />
          ))}
        </div>

        <div className="mt-12 relative overflow-hidden py-5 hairline">
          <div className="flex gap-3 animate-marquee whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-mono text-slate-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                {m}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#07060d] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#07060d] to-transparent" />
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, delay }: { skill: Skill; delay: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="hairline p-7 hover-lift fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-2xl surface text-indigo-300">
          <skill.icon size={20} />
        </span>
        <div>
          <h3 className="font-display text-lg font-medium text-slate-100">{skill.name}</h3>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-600">
            {skill.tag}
          </span>
        </div>
        <span className="ml-auto font-mono text-xl font-medium text-indigo-300">{skill.level}%</span>
      </div>
      <div className="mt-5 h-2.5 rounded-full bg-white/[0.04] overflow-hidden border border-white/5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${skill.color} animate-bar transition-[width] duration-1000 ease-out shadow-lg`}
          style={{ width: visible ? `${skill.level}%` : '0%' }}
        />
      </div>
    </div>
  );
}
