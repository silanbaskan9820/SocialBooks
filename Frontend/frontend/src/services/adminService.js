import api from "../api/api";

export const getDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data;
}