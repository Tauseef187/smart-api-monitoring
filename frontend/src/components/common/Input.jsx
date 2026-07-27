function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        className={`w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

export default Input;

