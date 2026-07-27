// backend/services/monitorService.js

const axios = require("axios");
const Api = require("../models/Api");
const MonitoringHistory = require("../models/MonitoringHistory");
const { predictAnomaly } = require('./aiService');  // ← moved to top with other requires

const checkApis = async () => {
    const apis = await Api.find();

    for (const api of apis) {
        try {
            const start = Date.now();

            const response = await axios({
                method: api.method,
                url: api.url,
                timeout: 5000
            });

            const responseTime = Date.now() - start;

            // ── AI Prediction (safe — won't crash monitoring if AI is down) ──
            let aiResult = null;
            try {
                aiResult = await predictAnomaly(
                    api._id.toString(),
                    responseTime,
                    new Date().toISOString()
                );
            } catch (aiErr) {
                console.error('[AI] Prediction skipped:', aiErr.message);
            }

            // ── Update Api document ──
            api.status          = "UP";
            api.lastStatusCode  = response.status;
            api.lastResponseTime = responseTime;
            api.lastChecked     = new Date();
            await api.save();

            // ── Save history with AI fields ──
            await MonitoringHistory.create({
                api:          api._id,
                status:       "UP",
                statusCode:   response.status,
                responseTime: responseTime,
                isAnomaly:    aiResult?.isAnomaly    ?? false,
                aiConfidence: aiResult?.confidence   ?? 0,
                aiSeverity:   aiResult?.severity     ?? 'normal',
                zScore:       aiResult?.z_score      ?? 0,
            });

            console.log(`✅ ${api.name} UP (${responseTime}ms) | Anomaly: ${aiResult?.isAnomaly ?? 'N/A'} | Confidence: ${aiResult?.confidence ?? 0}%`);

        } catch (error) {
            api.status           = "DOWN";
            api.lastStatusCode   = 0;
            api.lastResponseTime = 0;
            api.lastChecked      = new Date();
            await api.save();

            await MonitoringHistory.create({
                api:          api._id,
                status:       "DOWN",
                statusCode:   0,
                responseTime: 0,
                isAnomaly:    false,
                aiConfidence: 0,
                aiSeverity:   'normal',
                zScore:       0,
            });

            console.log(`❌ ${api.name} DOWN`);
        }
    }
};

module.exports = checkApis;