import ChartCard from "../components/charts/ChartCard";
import EmptyState from "../components/common/EmptyState";
import AlertTimeline from "../components/dashboard/AlertTimeline";
import { useMonitoringData } from "../hooks/useMonitoringData";

function AlertsPage() {
  const { apis } = useMonitoringData();

  const alertItems = apis.flatMap((api) => api.history.filter((item) => item.status === "DOWN").map((item) => ({ id: `${api._id}-${item._id}`, title: `${api.name} API Down`, status: "DOWN", description: `Email Sent for failure with status code ${item.statusCode || 0}. Recovered events will appear once healthy checks resume.`, timestamp: item.checkedAt }))).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return <ChartCard title="Alerts" subtitle="Alert history and incident timeline">{alertItems.length ? <AlertTimeline items={alertItems} /> : <EmptyState title="No alerts triggered" description="Downtime alerts, recovery notifications, and email delivery events will be collected here." />}</ChartCard>;
}

export default AlertsPage;

