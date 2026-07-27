import { useParams } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/charts/ChartCard";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import StatCard from "../components/dashboard/StatCard";
import { useMonitoringData } from "../hooks/useMonitoringData";
import { formatDateTime, formatLatency, formatPercent } from "../utils/formatters";

function ApiDetailsPage() {
  const { apiId } = useParams();
  const { apis, loading } = useMonitoringData();
  const api = apis.find((item) => item._id === apiId);

  if (!loading && !api) return <EmptyState title="API not found" description="The requested API could not be loaded from your monitoring workspace." />;
  if (!api) return null;

  const trendData = api.history.slice(0, 12).reverse().map((item, index) => ({ label: `${index + 1}`, responseTime: item.responseTime }));

  return (
    <div className="space-y-6">
      <div className="card-surface p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.3em] text-brand-primary">Endpoint detail</p><h2 className="mt-2 font-display text-4xl font-bold text-white">{api.name}</h2><p className="mt-2 text-slate-400">{api.url}</p></div><StatusBadge status={api.currentStatus} /></div></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><StatCard title="Current Latency" value={api.currentLatency} suffix=" ms" /><StatCard title="Average Latency" value={api.averageLatency} suffix=" ms" tone="green" /><StatCard title="Max Latency" value={api.maxLatency} suffix=" ms" tone="yellow" /><StatCard title="Min Latency" value={api.minLatency} suffix=" ms" /><StatCard title="Status Code" value={api.statusCode} tone="red" /><StatCard title="Uptime" value={api.uptimePercentage} suffix="%" tone="green" /></div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><ChartCard title="Response Time History" subtitle="Latest latency curve"><div className="h-80"><ResponsiveContainer><LineChart data={trendData}><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Line type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={3} /></LineChart></ResponsiveContainer></div></ChartCard><ChartCard title="Current Status Card" subtitle="Endpoint snapshot"><div className="space-y-4 text-sm text-slate-300"><div className="flex justify-between"><span>Current status</span><StatusBadge status={api.currentStatus} /></div><div className="flex justify-between"><span>Last checked</span><span>{formatDateTime(api.lastChecked)}</span></div><div className="flex justify-between"><span>Average latency</span><span>{formatLatency(api.averageLatency)}</span></div><div className="flex justify-between"><span>Status code</span><span>{api.statusCode}</span></div><div className="flex justify-between"><span>Total checks</span><span>{api.totalChecks}</span></div><div className="flex justify-between"><span>Uptime</span><span>{formatPercent(api.uptimePercentage)}</span></div></div></ChartCard></div>
      <ChartCard title="Timeline of all checks" subtitle="Status history"><div className="space-y-4">{api.history.map((item) => <div key={item._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4"><div><p className="font-medium text-white">{formatDateTime(item.checkedAt)}</p><p className="text-sm text-slate-400">Response time {formatLatency(item.responseTime)}</p></div><div className="flex items-center gap-3"><span className="text-sm text-slate-400">Code {item.statusCode || 0}</span><StatusBadge status={item.status} /></div></div>)}</div></ChartCard>
    </div>
  );
}

export default ApiDetailsPage;

