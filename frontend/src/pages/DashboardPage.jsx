import { FiActivity, FiAlertTriangle, FiCheckCircle, FiClock, FiGlobe, FiZap } from "react-icons/fi";
import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import ChartCard from "../components/charts/ChartCard";
import StatCard from "../components/dashboard/StatCard";
import StatusBadge from "../components/common/StatusBadge";
import AlertTimeline from "../components/dashboard/AlertTimeline";
import { useMonitoringData } from "../hooks/useMonitoringData";
import { formatDateTime, formatLatency, formatPercent } from "../utils/formatters";

function DashboardPage() {
  const { apis, loading, metrics } = useMonitoringData();

  if (loading) return <LoadingSkeleton className="min-h-[60vh] rounded-[2rem]" />;
  if (!apis.length) return <EmptyState title="No monitored APIs yet" description="Connect your first endpoint to unlock uptime charts, response-time history, and alert timelines." />;

  const recentActivity = apis.slice(0, 5);
  const combinedHistory = apis.flatMap((api) => api.history.slice(0, 7).map((item) => ({ ...item, apiName: api.name }))).sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt)).slice(0, 8);
  const pieData = [
    { name: "UP", value: metrics.healthyApis, color: "#22C55E" },
    { name: "DOWN", value: metrics.downApis, color: "#EF4444" },
  ];
  const trendData = apis[0].history.slice(0, 7).reverse().map((item, index) => ({ label: `Check ${index + 1}`, latency: item.responseTime || 0, uptime: item.status === "UP" ? 100 : 0 }));
  const alertItems = combinedHistory.filter((item) => item.status === "DOWN").slice(0, 4).map((item) => ({ id: `${item._id}-alert`, title: `${item.apiName} reported downtime`, status: "DOWN", description: `Status code ${item.statusCode || 0} with ${item.responseTime || 0} ms latency.`, timestamp: item.checkedAt }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total APIs" value={metrics.totalApis} icon={FiGlobe} />
        <StatCard title="Healthy APIs" value={metrics.healthyApis} icon={FiCheckCircle} tone="green" />
        <StatCard title="Down APIs" value={metrics.downApis} icon={FiAlertTriangle} tone="red" />
        <StatCard title="Average Latency" value={metrics.averageLatency} suffix=" ms" icon={FiZap} />
        <StatCard title="Uptime" value={metrics.uptime} suffix="%" icon={FiActivity} tone="green" />
        <StatCard title="Total Checks" value={metrics.totalChecks} icon={FiClock} tone="yellow" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartCard title="Latency Trend" subtitle="Response time over the latest checks">
          <div className="h-80"><ResponsiveContainer><AreaChart data={trendData}><defs><linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} /><stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} /></linearGradient></defs><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Area type="monotone" dataKey="latency" stroke="#60a5fa" fill="url(#latencyFill)" /></AreaChart></ResponsiveContainer></div>
        </ChartCard>
        <ChartCard title="Health Distribution" subtitle="Current endpoint status mix">
          <div className="h-80"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={110}>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
        </ChartCard>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Recent Activity" subtitle="Latest monitored APIs and status changes">
          <div className="space-y-4">{recentActivity.map((api) => <div key={api._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4"><div><p className="font-semibold text-white">{api.name}</p><p className="text-sm text-slate-400">{api.url}</p></div><div className="flex items-center gap-3"><span className="text-sm text-slate-300">{formatLatency(api.currentLatency)}</span><StatusBadge status={api.currentStatus} /><span className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDateTime(api.lastChecked)}</span></div></div>)}</div>
        </ChartCard>
        <ChartCard title="Latest Alerts" subtitle="Incident timeline for recent failures">
          {alertItems.length ? <AlertTimeline items={alertItems} /> : <EmptyState title="Quiet alert channel" description={`Everything looks stable. Current fleet uptime is ${formatPercent(metrics.uptime)}.`} />}
        </ChartCard>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Uptime Bar Graph" subtitle="Daily uptime snapshot"><div className="h-72"><ResponsiveContainer><BarChart data={trendData}><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Bar dataKey="uptime" fill="#22C55E" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>
        <ChartCard title="Response Time Graph" subtitle="Fine-grained latency line view"><div className="h-72"><ResponsiveContainer><LineChart data={trendData}><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Line type="monotone" dataKey="latency" stroke="#6366F1" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></ChartCard>
      </div>
    </div>
  );
}

export default DashboardPage;

