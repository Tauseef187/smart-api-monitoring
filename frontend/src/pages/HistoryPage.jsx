import { useMemo, useState } from "react";
import ChartCard from "../components/charts/ChartCard";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";
import StatusBadge from "../components/common/StatusBadge";
import { useMonitoringData } from "../hooks/useMonitoringData";
import { formatDateTime, formatLatency } from "../utils/formatters";

function HistoryPage() {
  const { apis, selectedApi, selectedApiId, setSelectedApiId } = useMonitoringData();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [dateFilter, setDateFilter] = useState("");

  const filteredHistory = useMemo(() => {
    const history = selectedApi?.history || [];
    if (!dateFilter) return history;
    return history.filter((item) => item.checkedAt?.startsWith(dateFilter));
  }, [dateFilter, selectedApi]);

  if (!apis.length) return <EmptyState title="No history available" description="Once your APIs are monitored, each check will appear here with time, latency, and status data." />;

  const totalPages = Math.ceil(filteredHistory.length / pageSize) || 1;
  const currentRows = filteredHistory.slice((page - 1) * pageSize, page * pageSize);

  return (
    <ChartCard title="Monitoring History" subtitle="Professional history table with filtering and pagination" action={<div className="flex flex-wrap gap-3"><select value={selectedApiId} onChange={(event) => { setSelectedApiId(event.target.value); setPage(1); }} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white">{apis.map((api) => <option key={api._id} value={api._id}>{api.name}</option>)}</select><input type="date" value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1); }} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white" /></div>}>
      <div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-slate-500"><tr><th className="pb-4">Time</th><th className="pb-4">Latency</th><th className="pb-4">Status</th><th className="pb-4">Status Code</th></tr></thead><tbody>{currentRows.map((row) => <tr key={row._id} className="border-t border-white/5 text-slate-200"><td className="py-4">{formatDateTime(row.checkedAt)}</td><td className="py-4">{formatLatency(row.responseTime)}</td><td className="py-4"><StatusBadge status={row.status} /></td><td className="py-4">{row.statusCode || 0}</td></tr>)}</tbody></table></div>
      <div className="mt-6"><Pagination page={page} totalPages={totalPages} onPageChange={setPage} /></div>
    </ChartCard>
  );
}

export default HistoryPage;

