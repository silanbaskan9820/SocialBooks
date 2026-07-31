import api from "../api/api";

export const createComment = async (commentData) => {
    const response = await api.post("/comments/createComment", commentData);
    return response.data;
}

export const getCommentsByPost = async (postId) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
}

export const updateComment = async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
}

export const deleteComment = async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
}