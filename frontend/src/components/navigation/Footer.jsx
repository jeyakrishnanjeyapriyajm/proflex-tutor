import {
  GraduationCap,
  Mail,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const platformLinks = [
    {
      label: "Features",
      to: "/features",
    },
    {
      label: "How It Works",
      to: "/how-it-works",
    },
    {
      label: "Curriculum",
      to: "/curriculum",
    },
    {
      label: "About",
      to: "/about",
    },
  ];

  const learningLinks = [
    {
      label: "Student Login",
      to: "/login",
    },
    {
      label: "Register",
      to: "/register/student",
    },
    {
      label: "Instructor Access",
      to: "/register/lecturer",
    },
    {
      label: "Dashboard",
      to: "/student",
    },
  ];

  const supportLinks = [
    {
      label: "Help Center",
      to: "/about",
    },
    {
      label: "Contact",
      to: "/about",
    },
    {
      label: "Privacy Policy",
      to: "/privacy",
    },
    {
      label: "Terms",
      to: "/terms",
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-8 shadow-2xl shadow-blue-950/30 md:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-sky-100">
                <BrainCircuit size={16} />
                AI Assistive C Tutor
              </div>

              <h2 className="max-w-2xl text-3xl font-black tracking-tight md:text-4xl">
                Build stronger C programming skills with adaptive learning.
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-sky-100 md:text-base">
                ProgFlex supports students with personalized task giving,
                difficulty analysis, mastery tracking, and AI-based learning
                support.
              </p>
            </div>

            <Link
              to="/register/student"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-blue-700 shadow-lg shadow-blue-900/20 transition hover:bg-slate-100"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-sky-950/40">
                <GraduationCap className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight">ProgFlex</h3>
                <p className="text-sm font-semibold text-slate-400">
                  Adaptive C Programming Tutor
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm font-medium leading-7 text-slate-400">
              A smart learning platform designed for first-year programming
              students. It helps learners practise C programming through
              adaptive questions, recovery support, and progress analytics.
            </p>

            <div className="mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <BookOpen className="mb-3 text-sky-400" size={22} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Learn
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <BrainCircuit className="mb-3 text-indigo-400" size={22} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Adapt
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <BarChart3 className="mb-3 text-emerald-400" size={22} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Improve
                </p>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h4 className="mb-5 text-lg font-black text-white">Platform</h4>

              <ul className="space-y-3 text-sm font-semibold text-slate-400">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-black text-white">Learning</h4>

              <ul className="space-y-3 text-sm font-semibold text-slate-400">
                {learningLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-5 text-lg font-black text-white">Support</h4>

              <ul className="space-y-3 text-sm font-semibold text-slate-400">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="transition hover:text-sky-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="mb-2 flex items-center gap-2 text-sky-400">
                  <Mail size={17} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Contact
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-400">
                  support@progflex.edu
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm font-semibold text-slate-500 sm:flex-row">
          <p>© 2026 ProgFlex. All rights reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck size={16} />
              Secure Learning Platform
            </span>

            <Link to="/privacy" className="transition hover:text-white">
              Privacy
            </Link>

            <Link to="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
