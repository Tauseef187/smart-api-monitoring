import api from './api';

export const getAiInsights = (apiId) =>
  api.get(`/ai/insights/${apiId}`).then(r => r.data);