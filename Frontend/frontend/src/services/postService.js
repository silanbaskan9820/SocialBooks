import api from "../api/api";

export const createPost = async (formData) => {

    const token = localStorage.getItem("token");

    const response = await api.post("/posts/createPost", 
        formData,
    {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
);

    return response.data;
};

export const getAllPosts = async () => {
    const response = await api.get("/posts/getAll");

    return response.data;
};

export const likePost = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.put(
        `/posts/${id}/like`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getPostById = async (id) => {
    const response = await api.get(`/posts/${id}`);

    return response.data;
} 

export const updatePost = async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);

    return response.data;
}

export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
}