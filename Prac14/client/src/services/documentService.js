
import api from "./api";

const documentService = {
  async getDocuments(params = {}) {
    const response = await api.get("/documents", { params });
    return response.data;
  },

  async getDocument(id) {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/documents", formData);
    return response.data;
  },

  async downloadDocument(id) {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });

    return response.data;
  },

  async renameDocument(id, data) {
    const response = await api.patch(`/documents/${id}`, data);
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export default documentService;
