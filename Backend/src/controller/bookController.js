import Book from "../models/Book.js";

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