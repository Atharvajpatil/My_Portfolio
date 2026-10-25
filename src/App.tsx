import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import MiniGame from '@/components/MiniGame';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CursorGlow from '@/components/CursorGlow';
import { applyTheme } from '@/components/ThemeToggle';

export default function App() {
  useEffect(() => {
    const stored = (localStorage.getItem('theme') as 'dark' | 'light' | null) ?? 'dark';
    applyTheme(stored);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian bg-aurora bg-grain text-slate-300 selection:bg-indigo-400/30">
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <MiniGame />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
