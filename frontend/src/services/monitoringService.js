import api from "./api";

export const monitoringService = {
  async getApis() {
    const { data } = await api.get("/apis");
    return data;
  },
  async createApi(payload) {
    const { data } = await api.post("/apis", payload);
    return data;
  },
  async updateApi(id, payload) {
    const { data } = await api.put(`/apis/${id}`, payload);
    return data;
  },
  async deleteApi(id) {
    const { data } = await api.delete(`/apis/${id}`);
    return data;
  },
  async getHistory(apiId) {
    const { data } = await api.get(`/history/${apiId}`);
    return data;
  },
  async getAnalytics(apiId) {
    const { data } = await api.get(`/analytics/${apiId}`);
    return data;
  },
};