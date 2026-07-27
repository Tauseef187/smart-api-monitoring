// backend/controllers/aiController.js
const MonitoringHistory = require('../models/MonitoringHistory');
const { predictBatch }  = require('../services/aiService');

// GET /api/ai/insights/:apiId
// Returns anomaly summary for the AI Insights page
const getAiInsights = async (req, res) => {
  try {
    const { apiId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const history = await MonitoringHistory
      .find({ api: apiId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const anomalies  = history.filter(h => h.isAnomaly);
    const total      = history.length;
    const anomalyPct = total ? ((anomalies.length / total) * 100).toFixed(1) : 0;

    // Group by severity
    const bySeverity = { normal: 0, medium: 0, high: 0, critical: 0 };
    history.forEach(h => { bySeverity[h.aiSeverity || 'normal']++ });

    // Recent anomalies list
    const recentAnomalies = anomalies.slice(0, 10).map(h => ({
      timestamp:   h.createdAt,
      responseTime: h.responseTime,
      confidence:  h.aiConfidence,
      severity:    h.aiSeverity,
      zScore:      h.zScore,
    }));

    res.json({
      apiId,
      summary: {
        totalChecks:   total,
        totalAnomalies: anomalies.length,
        anomalyRate:   `${anomalyPct}%`,
        bySeverity,
      },
      recentAnomalies,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAiInsights };