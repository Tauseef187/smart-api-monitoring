import { motion } from "framer-motion";

function ChartCard({ title, subtitle, children, action }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

export default ChartCard;

