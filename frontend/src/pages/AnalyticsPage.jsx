import { useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartCard from "../components/charts/ChartCard";
import EmptyState from "../components/common/EmptyState";
import StatCard from "../components/dashboard/StatCard";
import { useMonitoringData } from "../hooks/useMonitoringData";

function AnalyticsPage() {
  const { apis, selectedApi, selectedApiId, setSelectedApiId } = useMonitoringData();

  const trendData = useMemo(() => (selectedApi?.history || []).slice(0, 10).reverse().map((item, index) => ({ label: `T${index + 1}`, latency: item.responseTime || 0, success: item.status === "UP" ? 1 : 0, failure: item.status === "DOWN" ? 1 : 0 })), [selectedApi]);

  if (!apis.length) return <EmptyState title="Analytics will appear here" description="Create an API monitor to unlock latency, uptime, and reliability analytics." />;

  const pieData = [
    { name: "Success", value: selectedApi?.successChecks || 0, color: "#22C55E" },
    { name: "Failure", value: selectedApi?.failedChecks || 0, color: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      <ChartCard title="Analytics" subtitle="Detailed endpoint performance metrics" action={<select value={selectedApiId} onChange={(event) => setSelectedApiId(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white">{apis.map((api) => <option key={api._id} value={api._id}>{api.name}</option>)}</select>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><StatCard title="Average Latency" value={selectedApi?.averageLatency} suffix=" ms" /><StatCard title="Maximum Latency" value={selectedApi?.maxLatency} suffix=" ms" tone="yellow" /><StatCard title="Minimum Latency" value={selectedApi?.minLatency} suffix=" ms" tone="green" /><StatCard title="Uptime" value={selectedApi?.uptimePercentage} suffix="%" tone="green" /><StatCard title="Failure Rate" value={selectedApi ? 100 - selectedApi.uptimePercentage : 0} suffix="%" tone="red" /><StatCard title="Success Rate" value={selectedApi?.uptimePercentage} suffix="%" /></div>
      </ChartCard>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><ChartCard title="Latency Trend" subtitle="Rolling response-time performance"><div className="h-80"><ResponsiveContainer><AreaChart data={trendData}><defs><linearGradient id="analyticsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366F1" stopOpacity={0.6} /><stop offset="95%" stopColor="#6366F1" stopOpacity={0.05} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Area dataKey="latency" stroke="#818cf8" fill="url(#analyticsFill)" /></AreaChart></ResponsiveContainer></div></ChartCard><ChartCard title="Success vs Failure" subtitle="Check outcome distribution"><div className="h-80"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="value" innerRadius={70} outerRadius={110}>{pieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></ChartCard></div>
      <ChartCard title="Daily Checks" subtitle="Success and failure counts across recent checks"><div className="h-80"><ResponsiveContainer><BarChart data={trendData}><XAxis dataKey="label" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip /><Bar dataKey="success" fill="#22C55E" radius={[8, 8, 0, 0]} /><Bar dataKey="failure" fill="#EF4444" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div></ChartCard>
    </div>
  );
}

export default AnalyticsPage;

