import { useState } from 'react';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Github,
  Instagram,
  MapPin,
  ExternalLink,
  X,
} from 'lucide-react';
import { SectionHeading } from './About';
import { supabase } from '@/lib/supabase';

const EMAIL = 'f20260168@hyderabad.bits-pilani.ac.in';
const GITHUB = 'https://github.com/Atharvajpatil';
const INSTAGRAM = 'https://instagram.com/atharva.102030';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string>('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setError('Please fill in every field before sending.');
      showToast('error', 'Please fill in every field before sending.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error');
      setError('That email address looks off — double-check it.');
      showToast('error', 'That email address looks off — double-check it.');
      return;
    }

    setStatus('loading');
    setError('');

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    try {
      // 1. Persist to the database (source of truth).
      const { error: dbError } = await supabase
        .from('contact_messages')
        .insert({ name, email, message });

      if (dbError) {
        setStatus('error');
        setError('The server rejected the message. You can still email me directly below.');
        showToast('error', 'Could not send. Try the direct email link instead.');
        return;
      }

      // 2. Best-effort email forward via the edge function.
      //    Runs in the background — a failure here does NOT fail the submission,
      //    because the message is already safely stored in the database.
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`;
      fetch(fnUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ name, email, message }),
      }).catch(() => {
        // Swallow — the DB save is the source of truth.
      });

      const firstName = name.split(' ')[0];
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      showToast('success', `Message received — thanks ${firstName}! I'll get back to you soon.`);
      setTimeout(() => setStatus('idle'), 6000);
    } catch {
      setStatus('error');
      setError('Network issue — please try again or email me directly.');
      showToast('error', 'Network issue — please try again or email me directly.');
    }
  };

  return (
    <section id="contact" className="relative py-32 px-5 z-10">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] fade-up">
          <div
            className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl surface-strong border ${
              toast.type === 'success'
                ? 'border-teal-400/40 text-teal-200'
                : 'border-rose-400/40 text-rose-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{toast.msg}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-500 hover:text-slate-200"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl">
        <SectionHeading index="05" title="Contact" kicker="say hello" />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="hairline p-7 sm:p-8 space-y-5 fade-up">
            <div>
              <h3 className="font-display text-2xl font-medium text-slate-100">Send a message</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                Submissions go straight to my inbox. I usually reply within a day.
              </p>
            </div>

            <Field
              label="Name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              placeholder="Your name"
            />
            <Field
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              placeholder="you@example.com"
            />
            <div>
              <label className="block text-xs font-semibold tracking-[0.25em] uppercase text-indigo-300">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="What's on your mind?"
                rows={5}
                className="mt-2 w-full rounded-xl bg-[#070610]/60 border border-indigo-500/20 px-4 py-3.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-5 py-3.5 font-semibold text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'loading' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Send Message
            </button>

            {status === 'success' && (
              <p className="flex items-center gap-2 text-sm text-teal-300 bg-teal-500/10 border border-teal-500/30 rounded-lg px-3.5 py-2.5 fade-up">
                <CheckCircle2 size={16} /> Message sent — thanks for reaching out! I'll get back to
                you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="flex items-center gap-2 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3.5 py-2.5 fade-up">
                <AlertCircle size={16} /> {error}
              </p>
            )}
          </form>

          <div className="space-y-4 fade-up" style={{ animationDelay: '0.15s' }}>
            <div className="hairline p-7 hover-lift">
              <h3 className="font-display text-xl font-medium text-slate-100">Let's connect</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                Whether it's a collab, a question, or just a vibe — drop a message or reach me
                directly on any of these.
              </p>
              <div className="mt-5 space-y-2.5">
                <SocialLink
                  href={`mailto:${EMAIL}`}
                  icon={Mail}
                  label="Email"
                  value={EMAIL}
                  accent="text-indigo-300"
                />
                <SocialLink
                  href={GITHUB}
                  icon={Github}
                  label="GitHub"
                  value="github.com/Atharvajpatil"
                  accent="text-cyan-300"
                  external
                />
                <SocialLink
                  href={INSTAGRAM}
                  icon={Instagram}
                  label="Instagram"
                  value="@atharva.102030"
                  accent="text-fuchsia-300"
                  external
                />
              </div>
            </div>

            <div className="hairline p-7">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={14} className="text-indigo-300" />
                <span className="text-xs font-semibold tracking-[0.25em] uppercase">Based in</span>
              </div>
              <p className="mt-3 text-slate-200 font-display text-lg font-medium">
                BITS Pilani, Hyderabad Campus
              </p>
              <p className="text-sm text-slate-500">Computer Science &amp; Engineering</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-[0.25em] uppercase text-indigo-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl bg-[#070610]/60 border border-indigo-500/20 px-4 py-3.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-transparent"
      />
    </div>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
  value,
  accent,
  external,
}: {
  href: string;
  icon: typeof Mail;
  label: string;
  value: string;
  accent: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3.5 hover:border-indigo-400/40 hover:bg-white/[0.06] transition-all hover:translate-x-1"
    >
      <span className={`grid h-10 w-10 place-items-center rounded-lg surface ${accent}`}>
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-slate-500 font-mono">{label}</span>
        <span className="block text-sm font-medium text-slate-200 truncate">{value}</span>
      </span>
      {external && <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-300" />}
    </a>
  );
}
