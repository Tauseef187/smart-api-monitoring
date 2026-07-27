import { motion } from "framer-motion";

function EmptyState({ title, description, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-panel flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" />
      <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 max-w-md text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </motion.div>
  );
}

export default EmptyState;

