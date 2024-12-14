import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = {
  test: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/test`, data);
    return response.data;
  },
};

export default api;
