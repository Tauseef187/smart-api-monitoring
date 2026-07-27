import { motion } from "framer-motion";

function Button({ children, className = "", variant = "primary", loading = false, ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-brand-primary via-blue-500 to-brand-secondary text-white shadow-glow",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    ghost: "bg-white/5 text-slate-200 hover:bg-white/10",
    danger: "bg-brand-danger/90 text-white hover:bg-brand-danger",
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </motion.button>
  );
}

export default Button;

