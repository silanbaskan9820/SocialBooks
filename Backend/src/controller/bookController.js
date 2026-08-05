import Book from "../models/Book.js";
import axios from "axios";

export async function createBook(req, res) {
    try {

        const book = await Book.create(req.body);

        res.status(201).json({
            message: "Book created successfully",
            book,
        });

    } catch (error) {

        console.error("Error in createBook controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export async function getAllBooks(req, res) {
    try {

        const books = await Book.find().sort({
            createdAt: -1,
        });

        res.status(200).json(books);

    } catch (error) {

        console.error("Error in getAllBooks controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function getBookById(req, res) {
    try {

        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        res.status(200).json(book);

    } catch (error) {

        console.error("Error in getBookById controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function searchBooks(req, res) {
    try {

        const { q } = req.query;

        const books = await Book.find({
            title: {
                $regex: q,
                $options: "i",
            },
        });

        res.status(200).json(books);

    } catch (error) {

        console.error("Error in searchBooks controller", error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function searchGoogleBooks(req, res) {
    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }

        const response = await axios.get(
            "https://www.googleapis.com/books/v1/volumes",
            {
                params: {
                    q,
                    maxResults: 10,
                },
            }
        );

        const books = response.data.items?.map((item) => ({
            googleBookId: item.id,
            title: item.volumeInfo.title,
            author: item.volumeInfo.authors?.join(", ") || "Unknown",
            description: item.volumeInfo.description || "",
            genre: item.volumeInfo.categories?.[0] || "",
            pageCount: item.volumeInfo.pageCount || 0,
            publishedYear: item.volumeInfo.publishedDate || "",
            isbn:
                item.volumeInfo.industryIdentifiers?.[0]?.identifier || "",
            coverImage:
                item.volumeInfo.imageLinks?.thumbnail || "",
        })) || [];

        res.json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Google Books API Error"
        });

    }
}