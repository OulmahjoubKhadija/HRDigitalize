import api from "../api/axios";

export const salarieService = {
  list: (params) => api.get("/salaries", { params }),
  update: (id, data) => api.put(`/salaries/${id}`, data),
  delete: (id) => api.delete(`/salaries/${id}`),
};
