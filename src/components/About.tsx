import { Code2, Zap, BrainCircuit, Gamepad2, ArrowRight } from 'lucide-react';

const BADGES = [
  { icon: Code2, label: 'Pure JavaScript Fundamentals', desc: 'Built from scratch, no shortcuts' },
  { icon: Zap, label: 'Rapid Prototyping', desc: 'Idea to working demo, fast' },
  { icon: BrainCircuit, label: 'AI Prompt Engineering', desc: 'Directing the code, not writing it' },
];

export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div className="fade-up">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-indigo-400">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-indigo-400/70 to-transparent" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-slate-600">
          {kicker ?? 'section'}
        </span>
      </div>
      <h2 className="mt-4 font-display text-4xl sm:text-6xl font-light text-slate-100 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative py-32 px-5 z-10">
      <div className="mx-auto max-w-5xl">
        <SectionHeading index="01" title="About Me" kicker="who I am" />

        <div className="mt-16 grid gap-12 md:grid-cols-5 items-start">
          <div className="md:col-span-3 space-y-6 text-slate-300 leading-[1.8] text-lg fade-up">
            <p>
              My journey into web creation started the old-school way — building basic browser
              games with <span className="serif-italic text-indigo-300 text-xl">pure JavaScript</span>,
              zero tutorials, zero AI. Just curiosity, a text editor, and a lot of broken builds.
            </p>
            <p>
              Those early experiments taught me how the web actually works under the hood. Today my
              workflow has evolved into{' '}
              <span className="serif-italic text-cyan-300 text-xl">vibe coding</span> — pairing
              that fundamental understanding with AI assistance to rapidly turn complex ideas into
              working software.
            </p>
            <p>
              The result: I ship faster, prototype bolder, and spend more time on the parts that
              matter — design, behavior, and the feel of a product.
            </p>
          </div>

          <div className="md:col-span-2 space-y-4 fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="hairline p-6 hover-lift overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-25 bg-cover bg-center transition-opacity duration-500 hover:opacity-40"
                style={{
                  backgroundImage:
                    "url('https://images.pexels.com/photos/29096083/pexels-photo-29096083.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
                  maskImage: 'linear-gradient(180deg, #000, transparent 75%)',
                  WebkitMaskImage: 'linear-gradient(180deg, #000, transparent 75%)',
                }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center gap-3 text-indigo-300">
                  <Gamepad2 size={22} />
                  <span className="font-display text-lg font-medium">Then</span>
                </div>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Hand-coded games. Every bug hunted manually. Every feature built from scratch.
                </p>
              </div>
            </div>
            <div className="hairline p-6 hover-lift">
              <div className="flex items-center gap-3 text-cyan-300">
                <BrainCircuit size={22} />
                <span className="font-display text-lg font-medium">Now</span>
              </div>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                AI-assisted builds where I direct the vision and the code follows. Speed without
                losing the fundamentals.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {BADGES.map((b, i) => (
            <div
              key={b.label}
              className="hairline p-6 hover-lift fade-up"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 border border-indigo-500/25 text-indigo-300">
                <b.icon size={22} />
              </span>
              <h3 className="mt-5 font-display text-lg font-medium text-slate-100">{b.label}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <a
          href="#projects"
          className="mt-12 inline-flex items-center gap-1.5 text-sm font-mono text-indigo-300 hover:text-indigo-200 group"
        >
          see what I've built
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </section>
  );
}
