import { FiBell, FiMoon, FiSearch } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="glass-panel mb-8 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-primary">Operations Console</p>
        <h1 className="font-display text-3xl font-bold text-white">Smart API Monitoring Platform</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="hidden min-w-72 items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 lg:flex">
          <FiSearch className="text-slate-500" />
          <input className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Search APIs, incidents, metrics..." />
        </label>
        <button className="rounded-2xl bg-white/5 p-3 text-slate-200"><FiBell /></button>
        <button className="rounded-2xl bg-white/5 p-3 text-slate-200"><FiMoon /></button>
        <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary font-semibold text-white">{user?.name?.[0] || "U"}</div>
          <div>
            <p className="text-sm font-semibold text-white">{user?.name || "Operator"}</p>
            <p className="text-xs text-slate-400">{user?.email || "team@smartmonitor.io"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

