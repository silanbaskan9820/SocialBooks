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