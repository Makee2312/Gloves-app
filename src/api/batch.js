import api from "./index";

export const BatchAPI = {
  getAllBatches: async () => {
    const res = await api.get("/batches");
    return res.data;
  },

  getBatchById: async (id) => {
    const res = await api.get(`/batches/${id}`);
    return res.data;
  },

  createBatch: async (batchData) => {
    const res = await api.post("/batches", batchData);
    return res.data;
  },

  updateBatch: async (id, updatedData) => {
    const res = await api.put(`/batches/${id}`, updatedData);
    return res.data;
  },

  deleteBatch: async (id) => {
    const res = await api.delete(`/batches/${id}`);
    return res.data;
  },
};
