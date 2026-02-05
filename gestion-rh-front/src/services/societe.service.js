import api from "../api/axios";

export const societeService = {
  list: (params) => api.get("/societe", { params }),

  create: (data) => api.post("/societe", data),

  update: (id, data) => {
    data.append("_method", "PUT");

    return api.post(`/societe/${id}`, data)
      .then(res => res.data);
  },

  delete: (id) => api.delete(`/societe/${id}`),
};
