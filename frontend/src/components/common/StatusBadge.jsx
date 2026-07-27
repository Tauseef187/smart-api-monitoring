import { relativeStatusTone } from "../../utils/formatters";

const tones = {
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  danger: "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  warning: "bg-amber-500/15 text-amber-200 ring-amber-300/20",
};

function StatusBadge({ status }) {
  const tone = tones[relativeStatusTone(status)];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${tone}`}>
      {status}
    </span>
  );
}

export default StatusBadge;

