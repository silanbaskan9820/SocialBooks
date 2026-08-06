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

export async function searchOpenLibraryBooks(req, res) {

    try {

        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search query is required."
            });
        }

        let response = await axios.get(
    "https://openlibrary.org/search.json",
    {
        params: {
            title: q,
            limit: 20,
        },
    }
);

// Eğer title ile sonuç bulunamazsa genel arama yap
if (!response.data.docs || response.data.docs.length === 0) {
    response = await axios.get(
        "https://openlibrary.org/search.json",
        {
            params: {
                q,
                limit: 20,
            },
        }
    );
}

//console.log(req.query.q);

//console.log(q);

//console.log(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}`);
        
        /*response.data.docs.forEach(book => {
            console.log(book.title, book.cover_i);
        });*/

        const books = response.data.docs.map((book) => {
            const coverImage = book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "";

    //console.log(coverImage);

    return {
        openLibraryId: book.key,
        title: book.title || "",
        author: book.author_name?.join(", ") || "Unknown",
        description: "",
        genre: book.subject?.[0] || "",
        pageCount: book.number_of_pages_median || 0,
        publishedYear: book.first_publish_year || "",
        isbn: book.isbn?.[0] || "",
        coverImage,
    };
});

        res.json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Open Library API Error"
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
