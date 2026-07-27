import { motion } from "framer-motion";
import CountUp from "react-countup";

function StatCard({ title, value, suffix = "", icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "from-brand-primary/30 to-blue-400/10",
    green: "from-brand-success/25 to-emerald-400/10",
    red: "from-brand-danger/20 to-rose-400/10",
    yellow: "from-brand-warning/25 to-amber-400/10",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={`card-surface bg-gradient-to-br ${tones[tone]} p-5`}>
      <div className="mb-10 flex items-center justify-between">
        <p className="text-sm text-slate-300">{title}</p>
        <div className="rounded-2xl bg-white/10 p-3 text-white">{Icon ? <Icon /> : null}</div>
      </div>
      <div className="font-display text-4xl font-bold text-white">
        <CountUp end={Number(value || 0)} decimals={suffix === "%" ? 1 : 0} duration={1.6} />
        {suffix}
      </div>
    </motion.div>
  );
}

export default StatCard;

