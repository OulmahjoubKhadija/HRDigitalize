import api from "../api/axios";

export const serviceService = {
  list: (params) => api.get("/service", { params }),
  create: (data) => api.post("/service", data),
  update: (id, data) => api.put(`/service/${id}`, data),
  delete: (id) => api.delete(`/service/${id}`),
};
