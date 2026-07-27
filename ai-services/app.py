from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from collections import deque
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# ── Load model artifacts ──────────────────────────────────────────────
# model     = joblib.load('anomaly_model.pkl')
# scaler    = joblib.load('scaler.pkl')
# FEATURES  = joblib.load('feature_names.pkl')
# THRESHOLD = joblib.load('threshold.pkl')
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model     = joblib.load(os.path.join(BASE_DIR, 'anomaly_model.pkl'))
scaler    = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
FEATURES  = joblib.load(os.path.join(BASE_DIR, 'feature_names.pkl'))
THRESHOLD = joblib.load(os.path.join(BASE_DIR, 'threshold.pkl'))

# ── In-memory rolling window per API endpoint ─────────────────────────
# Stores last 10 readings per apiId so we can compute rolling features
history_store = {}  # { apiId: deque([response_time, ...], maxlen=10) }

def compute_features(api_id, response_time, timestamp):
    """Build the 13 features your model expects from a single new reading."""

    if api_id not in history_store:
        history_store[api_id] = deque(maxlen=10)

    window = history_store[api_id]

    # Need at least 10 readings for full features
    # Pad with current value if window is short
    values = list(window) + [response_time]
    if len(values) < 10:
        values = [response_time] * (10 - len(values)) + values

    arr = np.array(values, dtype=float)

    # Rolling windows
    last5  = arr[-5:]
    last10 = arr[-10:]

    roll_mean_5  = np.mean(last5)
    roll_std_5   = np.std(last5)  + 1e-9
    roll_max_5   = np.max(last5)
    roll_min_5   = np.min(last5)
    roll_mean_10 = np.mean(last10)
    roll_std_10  = np.std(last10) + 1e-9

    z_score     = (response_time - roll_mean_5) / roll_std_5
    value_diff1 = response_time - arr[-2]
    value_diff3 = response_time - arr[-4]
    is_spike    = 1 if abs(z_score) > 2 else 0

    dt   = datetime.fromisoformat(timestamp) if timestamp else datetime.now()
    hour        = dt.hour
    day_of_week = dt.weekday()
    minute      = dt.minute

    features = {
        'value':        response_time,
        'hour':         hour,
        'day_of_week':  day_of_week,
        'minute':       minute,
        'roll_mean_5':  roll_mean_5,
        'roll_std_5':   roll_std_5,
        'roll_max_5':   roll_max_5,
        'roll_min_5':   roll_min_5,
        'roll_mean_10': roll_mean_10,
        'roll_std_10':  roll_std_10,
        'z_score':      z_score,
        'value_diff1':  value_diff1,
        'value_diff3':  value_diff3,
        'is_spike':     is_spike,
    }

    # Add to history AFTER computing features
    window.append(response_time)
    history_store[api_id] = window

    return features

# ── Routes ────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({ 'status': 'ok', 'model': 'RandomForest', 'threshold': THRESHOLD })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Expects JSON:
    {
        "apiId":        "abc123",
        "responseTime": 245.6,
        "timestamp":    "2024-01-15T14:30:00"   (optional)
    }
    """
    try:
        body          = request.get_json()
        api_id        = body.get('apiId', 'default')
        response_time = float(body.get('responseTime', 0))
        timestamp     = body.get('timestamp', datetime.now().isoformat())

        # Build features
        features = compute_features(api_id, response_time, timestamp)
        X = pd.DataFrame([features])[FEATURES]

        # Predict
        prob      = float(model.predict_proba(X)[0][1])
        is_anomaly = prob >= THRESHOLD

        # Severity level based on probability
        if prob >= 0.8:
            severity = 'critical'
        elif prob >= 0.6:
            severity = 'high'
        elif prob >= THRESHOLD:
            severity = 'medium'
        else:
            severity = 'normal'

        return jsonify({
            'apiId':      api_id,
            'isAnomaly':  bool(is_anomaly),
            'confidence': round(prob * 100, 2),
            'severity':   severity,
            'z_score':    round(features['z_score'], 3),
            'threshold':  THRESHOLD,
            'timestamp':  timestamp,
        })

    except Exception as e:
        return jsonify({ 'error': str(e) }), 500


@app.route('/predict/batch', methods=['POST'])
def predict_batch():
    """
    Expects JSON array:
    { "readings": [ { "apiId": "x", "responseTime": 200, "timestamp": "..." }, ... ] }
    """
    try:
        body     = request.get_json()
        readings = body.get('readings', [])
        results  = []

        for r in readings:
            api_id        = r.get('apiId', 'default')
            response_time = float(r.get('responseTime', 0))
            timestamp     = r.get('timestamp', datetime.now().isoformat())

            features  = compute_features(api_id, response_time, timestamp)
            X         = pd.DataFrame([features])[FEATURES]
            prob      = float(model.predict_proba(X)[0][1])
            is_anomaly = prob >= THRESHOLD

            results.append({
                'apiId':     api_id,
                'isAnomaly': bool(is_anomaly),
                'confidence': round(prob * 100, 2),
                'severity':  'critical' if prob >= 0.8 else 'high' if prob >= 0.6 else 'medium' if is_anomaly else 'normal',
                'timestamp': timestamp,
            })

        return jsonify({ 'results': results, 'total': len(results) })

    except Exception as e:
        return jsonify({ 'error': str(e) }), 500


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5001, debug=True)
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)