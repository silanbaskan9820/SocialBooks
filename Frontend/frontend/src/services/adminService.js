import api from "../api/api";

export const getDashboard = async () => {
    const response = await api.get("/admin/dashboard");

    return response.data;
}

export const getAllUsers = async (params = {}) => {
    const response = await api.get("/admin/users", {params});

    return response.data;
}

export const banUser = async (id) => {
    const response = await api.patch(`/admin/users/${id}/ban`);

    return response.data;
}

export const getAdminUserDetail = async (id) => {
    const response = await api.get(`/admin/users/${id}`);

    return response.data;
}

export const updateUserRole = async (id, role) => {
    const response = await api.patch(
        `/admin/users/${id}/role`,
        { role }
    );

    return response.data;
};