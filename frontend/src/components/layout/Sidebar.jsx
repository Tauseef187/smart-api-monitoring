import { NavLink } from "react-router-dom";
import { FiActivity, FiAlertCircle, FiBarChart2, FiClock, FiGrid, FiSettings, FiZap } from "react-icons/fi";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/app/apis", label: "My APIs", icon: FiActivity },
  { to: "/app/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/app/history", label: "History", icon: FiClock },
  { to: "/app/alerts", label: "Alerts", icon: FiAlertCircle },
  { to: "/app/ai-insights", label: "AI Insights", icon: FiZap },
  { to: "/app/settings", label: "Settings", icon: FiSettings },
];

function Sidebar() {
  return (
    <aside className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col p-5 lg:flex">
      <div className="mb-10">
        <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary px-4 py-3 font-display text-lg font-bold">Smart Monitor</div>
        <p className="text-sm text-slate-400">Observe latency, uptime, and incident patterns across every endpoint.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}>
              <Icon />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

