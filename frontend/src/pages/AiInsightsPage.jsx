import { useState, useEffect } from 'react';
import { getAiInsights } from '../services/aiService';

const AiInsightsPage = () => {
  const [insights, setInsights]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [apiId, setApiId]           = useState('');

  const fetchInsights = async () => {
    if (!apiId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAiInsights(apiId);
      setInsights(data);
    } catch (err) {
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apiId) fetchInsights();
  }, [apiId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Insights</h1>

      {/* API ID input — replace with a dropdown of your real APIs later */}
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Paste API ID here..."
          value={apiId}
          onChange={e => setApiId(e.target.value)}
          className="border rounded px-3 py-2 w-80 text-sm"
        />
        <button
          onClick={fetchInsights}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {/* States */}
      {loading && <p className="text-gray-500">Loading insights...</p>}
      {error   && <p className="text-red-500">{error}</p>}

      {/* Results */}
      {insights && (
        <div className="space-y-6">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Total Checks</p>
              <p className="text-2xl font-bold">{insights.summary.totalChecks}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Anomalies Found</p>
              <p className="text-2xl font-bold text-red-500">{insights.summary.totalAnomalies}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Anomaly Rate</p>
              <p className="text-2xl font-bold text-orange-500">{insights.summary.anomalyRate}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="text-xs text-gray-500 mb-1">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-700">
                {insights.summary.bySeverity.critical}
              </p>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="font-semibold mb-3">Severity Breakdown</h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              {Object.entries(insights.summary.bySeverity).map(([level, count]) => (
                <div key={level} className={`rounded p-3 ${
                  level === 'critical' ? 'bg-red-100 text-red-700' :
                  level === 'high'     ? 'bg-orange-100 text-orange-700' :
                  level === 'medium'   ? 'bg-yellow-100 text-yellow-700' :
                                         'bg-green-100 text-green-700'
                }`}>
                  <p className="text-lg font-bold">{count}</p>
                  <p className="text-xs capitalize">{level}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Anomalies Table */}
          {insights.recentAnomalies.length > 0 && (
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="font-semibold mb-3">Recent Anomalies</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Response Time</th>
                    <th className="pb-2">Confidence</th>
                    <th className="pb-2">Severity</th>
                    <th className="pb-2">Z-Score</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.recentAnomalies.map((a, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 text-gray-600">
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2">{a.responseTime}ms</td>
                      <td className="py-2">{a.confidence}%</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          a.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          a.severity === 'high'     ? 'bg-orange-100 text-orange-700' :
                                                       'bg-yellow-100 text-yellow-700'
                        }`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-2">{a.zScore?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {insights.recentAnomalies.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-medium">✅ No anomalies detected for this API</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AiInsightsPage;