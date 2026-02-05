import api from "../api/axios";

export const stagiaireService = {
  list: (params) => api.get("/stagiaires", { params }),
  update: (id, data) => api.put(`/stagiaires/${id}`, data),
  delete: (id) => api.delete(`/stagiaires/${id}`),
};
