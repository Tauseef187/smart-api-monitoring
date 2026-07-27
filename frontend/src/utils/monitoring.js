const methodPalette = {
  GET: "bg-sky-500/15 text-sky-300",
  POST: "bg-violet-500/15 text-violet-300",
  PUT: "bg-amber-500/15 text-amber-300",
  DELETE: "bg-rose-500/15 text-rose-300",
};

export function getMethodClass(method) {
  return methodPalette[method] || "bg-slate-700 text-slate-200";
}

export function buildApiSummary(api, history = [], analytics = {}) {
  const responseTimes = history.map((item) => item.responseTime || 0).filter(Boolean);
  const latest = history[0];

  return {
    ...api,
    currentStatus: latest?.status || api.status || "CHECKING",
    statusCode: latest?.statusCode || api.lastStatusCode || 0,
    currentLatency: latest?.responseTime || api.lastResponseTime || 0,
    averageLatency: Number(analytics.averageResponseTime || api.averageResponseTime || 0),
    maxLatency: Number(analytics.maximumResponseTime || Math.max(...responseTimes, 0)),
    minLatency: Number(analytics.minimumResponseTime || Math.min(...responseTimes, 0)),
    uptimePercentage: Number(analytics.uptimePercentage || api.uptimePercentage || 0),
    totalChecks: analytics.totalChecks || history.length || 0,
    successChecks: analytics.successChecks || history.filter((item) => item.status === "UP").length,
    failedChecks: analytics.failedChecks || history.filter((item) => item.status === "DOWN").length,
    history,
  };
}

export function buildDashboardMetrics(apiSummaries) {
  const totalApis = apiSummaries.length;
  const healthyApis = apiSummaries.filter((api) => api.currentStatus === "UP").length;
  const downApis = apiSummaries.filter((api) => api.currentStatus === "DOWN").length;
  const totalChecks = apiSummaries.reduce((sum, api) => sum + api.totalChecks, 0);
  const averageLatency = apiSummaries.reduce((sum, api) => sum + api.averageLatency, 0) / (totalApis || 1);
  const uptime = apiSummaries.reduce((sum, api) => sum + api.uptimePercentage, 0) / (totalApis || 1);

  return {
    totalApis,
    healthyApis,
    downApis,
    totalChecks,
    averageLatency,
    uptime,
  };
}

