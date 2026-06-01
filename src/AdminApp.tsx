import { FormEvent, useState } from 'react';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import AdminCMS from './components/AdminCMS';

const ADMIN_SESSION_KEY = 'psis_admin_session';

type AdminSession = {
  email: string;
  createdAt: string;
};

function getStoredSession(): AdminSession | null {
  const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
}

export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(getStoredSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || password.trim().length < 4) {
      setError('Enter your admin email and password.');
      return;
    }

    const nextSession = {
      email: email.trim(),
      createdAt: new Date().toISOString(),
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    setError('');
  }

  if (session) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-300 md:px-8">
          <div className="flex items-center gap-2">
            <ShieldCheck size={15} className="text-brand-gold" />
            <span className="font-bold uppercase tracking-wider">CMS secured session</span>
            <span className="hidden text-slate-500 sm:inline">{session.email}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(ADMIN_SESSION_KEY);
              setSession(null);
            }}
            className="rounded border border-slate-700 px-3 py-1.5 font-bold uppercase text-slate-200 transition hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
        <AdminCMS lang="en" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071B5C] px-4 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-5" />
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold text-[#071B5C]">
            <LockKeyhole size={24} />
          </div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-brand-gold">cms.psis.edu.kh</p>
          <h1 className="mt-2 font-serif text-3xl font-bold">PSIS Admin CMS</h1>
          <p className="mt-2 text-xs leading-6 text-slate-300">
            Sign in to manage hero banners, campus galleries, partner logos, student life, and news.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold"
              placeholder="admin@psis.edu.kh"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold"
              placeholder="Enter password"
            />
          </label>
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-brand-gold px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#071B5C] transition hover:bg-amber-400"
          >
            Sign in
          </button>
        </div>
      </form>
    </main>
  );
}
