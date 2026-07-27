import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiActivity, FiBarChart2, FiBell, FiCpu, FiGithub } from "react-icons/fi";
import Button from "../components/common/Button";

const features = [
  { icon: FiActivity, title: "API Monitoring", text: "Track uptime with fast visual feedback and clear incident trails." },
  { icon: FiBarChart2, title: "Real-time Dashboard", text: "Bring health, latency, and check volume into one executive-friendly view." },
  { icon: FiBell, title: "Email Alerts", text: "Surface downtime and recoveries with actionable alert context." },
  { icon: FiCpu, title: "AI Insights", text: "Spot anomaly patterns, outage risk, and likely root causes sooner." },
];

function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-brand-bg">
      <section className="relative isolate bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.12),transparent_20%)]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-20 flex items-center justify-between">
            <div className="font-display text-2xl font-bold text-white">Smart Monitor</div>
            <div className="flex gap-3">
              <Link to="/login"><Button variant="ghost">Login</Button></Link>
              <Link to="/register"><Button>Register</Button></Link>
            </div>
          </div>
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-200">
                Premium observability for modern API teams
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl font-display text-5xl font-bold leading-tight text-white md:text-7xl">
                Monitor APIs. Detect Failures. Predict Outages.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 max-w-2xl text-lg text-slate-300">
                Smart API Monitoring Platform gives engineering teams a polished command center for latency trends, uptime performance, alert timelines, and predictive health signals.
              </motion.p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/login"><Button className="min-w-36">Login</Button></Link>
                <Link to="/register"><Button variant="secondary" className="min-w-36">Register</Button></Link>
                <a href="https://github.com" target="_blank" rel="noreferrer"><Button variant="ghost" className="gap-2"><FiGithub /> Github</Button></a>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="gradient-border rounded-[2rem] bg-slate-900/70 p-6 shadow-glow">
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="glass-panel p-5">
                      <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3 text-blue-200"><Icon /></div>
                      <h3 className="font-display text-xl font-bold text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">{feature.text}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

