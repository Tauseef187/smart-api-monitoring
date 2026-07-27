import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatters";

function AlertTimeline({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-brand-danger shadow-[0_0_18px_rgba(239,68,68,0.8)]" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-semibold text-white">{item.title}</p>
              <StatusBadge status={item.status} />
            </div>
            <p className="mt-2 text-sm text-slate-400">{item.description}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{formatDateTime(item.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertTimeline;

