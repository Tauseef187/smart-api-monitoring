import { useState } from "react";
import ChartCard from "../components/charts/ChartCard";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../hooks/useAuth";

function SettingsPage() {
  const { user, logout } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <ChartCard title="Profile" subtitle="Update your operator profile"><div className="space-y-4"><Input label="Name" defaultValue={user?.name} /><Input label="Email" defaultValue={user?.email} /><Button>Save Profile</Button></div></ChartCard>
      <ChartCard title="Workspace Settings" subtitle="Password, notifications, and display preferences"><div className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><Input label="New Password" type="password" /><Input label="Confirm Password" type="password" /></div><div className="space-y-4 rounded-3xl border border-white/5 bg-white/[0.03] p-5"><ToggleRow title="Email Alerts Toggle" description="Receive downtime and recovery alerts in your inbox." checked={emailAlerts} onChange={setEmailAlerts} /><ToggleRow title="Dark Mode Toggle" description="Keep the command center in its default dark theme." checked={darkMode} onChange={setDarkMode} /></div><div className="flex flex-wrap gap-3"><Button>Save Settings</Button><Button variant="ghost" onClick={logout}>Logout</Button></div></div></ChartCard>
    </div>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div><p className="font-medium text-white">{title}</p><p className="text-sm text-slate-400">{description}</p></div>
      <button onClick={() => onChange(!checked)} className={`relative h-8 w-16 rounded-full transition ${checked ? "bg-brand-primary" : "bg-slate-700"}`}><span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${checked ? "left-9" : "left-1"}`} /></button>
    </div>
  );
}

export default SettingsPage;

