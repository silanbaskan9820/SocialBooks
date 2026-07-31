import api from "../api/api";

export const searchUsers = async (query) => {
    const response = await api.get("/users/search", {
        params: {
            query,
        },
    });

    return response.data;
};

export const searchPosts = async (query) => {
    const response = await api.get("/posts/search", {
        params: {
            query,
        },
    });

    return response.data;
};