export const formatLatency = (value) => `${Math.round(Number(value || 0))} ms`;
export const formatPercent = (value) => `${Number(value || 0).toFixed(1)}%`;

export const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(value))
    : "Not checked";

export const relativeStatusTone = (status) => {
  if (status === "UP") return "success";
  if (status === "DOWN") return "danger";
  return "warning";
};

