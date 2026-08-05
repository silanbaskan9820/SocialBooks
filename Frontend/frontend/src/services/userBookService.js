import api from "../api/api";

export const getReadingBooks = async () => {
    const response = await api.get("/user-books/reading");

    return response.data;
};

export const getWishlistBooks = async () => {
    const response = await api.get("/user-books/wishlist");

    return response.data;
}

export const addBookToUser = async (bookData) => {
    const response = await api.post("/user-books", bookData);

    return response.data;
}

export const updateCurrentPage = async (id, currentPage) => {

    const response = await api.put(
        `/user-books/${id}/page`,
        {
            currentPage,
        }
    );

    return response.data;

};

export const markBookAsCompleted = async (id) => {
    const response = await api.put(`/user-books/${id}/complete`);

    return response.data;
}

export const getCompletedBooks = async () => {
    const response = await api.get("/user-books/completed");

    return response.data;
}

export const moveBookToReading = async (id) => {
    const response = await api.put(`/user-books/${id}/read-again`);

    return response.data;
}

export const removeBook = async (id) => {
    const response = await api.delete(`/user-books/${id}`);

    return response.data;
}

export const updateRating = async (id, rating) => {
    const response = await api.put(`/user-books/${id}/rating`, { rating });

    return response.data;
}

export const updateBookStatus = async (id, status) => {
    const response = await api.patch(`/user-books/${id}/status`, { status });

    return response.data;
}

export const deleteUserBook = async (id) => {
    const response = await api.delete(`/user-books/${id}`);

    return response.data;
}