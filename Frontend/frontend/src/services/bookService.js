import api from "../api/api";

export const searchBooks = async (query) => {

    const response = await api.get(
        `/books/search?q=${query}`
    );

    return response.data;

};