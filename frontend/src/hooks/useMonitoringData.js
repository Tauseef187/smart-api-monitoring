import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { monitoringService } from "../services/monitoringService";
import { buildApiSummary, buildDashboardMetrics } from "../utils/monitoring";

export function useMonitoringData() {
  const [apis, setApis] = useState([]);
  const [selectedApiId, setSelectedApiId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);

      try {
        const apiList = await monitoringService.getApis();
        const details = await Promise.all(
          apiList.map(async (api) => {
            const [history, analytics] = await Promise.allSettled([
              monitoringService.getHistory(api._id),
              monitoringService.getAnalytics(api._id),
            ]);

            return buildApiSummary(
              api,
              history.status === "fulfilled" ? history.value : [],
              analytics.status === "fulfilled" ? analytics.value : {}
            );
          })
        );

        if (!ignore) {
          setApis(details);
          setSelectedApiId((current) => current || details[0]?._id || "");
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error.response?.data?.message || "Failed to load monitoring data");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const selectedApi = useMemo(
    () => apis.find((api) => api._id === selectedApiId) || apis[0] || null,
    [apis, selectedApiId]
  );

  return {
    apis,
    loading,
    selectedApi,
    selectedApiId,
    setSelectedApiId,
    metrics: buildDashboardMetrics(apis),
    refresh() {
      setRefreshKey((value) => value + 1);
    },
  };
}

