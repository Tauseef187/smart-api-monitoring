// backend/services/aiService.js
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

/**
 * Send a single reading to the ML model for anomaly prediction.
 * Called from monitorService.js after each health check.
 */
const predictAnomaly = async (apiId, responseTime, timestamp) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict`, {
      apiId,
      responseTime,
      timestamp: timestamp || new Date().toISOString(),
    }, { timeout: 3000 }); // 3s timeout — don't block monitoring if AI is slow

    return response.data;
  } catch (err) {
    // Fail silently — monitoring must never break because AI is down
    console.error('[aiService] Prediction failed:', err.message);
    return null;
  }
};

/**
 * Get predictions for a batch of historical readings.
 * Used by analytics controller.
 */
const predictBatch = async (readings) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict/batch`, {
      readings,
    }, { timeout: 10000 });

    return response.data.results;
  } catch (err) {
    console.error('[aiService] Batch prediction failed:', err.message);
    return [];
  }
};

module.exports = { predictAnomaly, predictBatch };