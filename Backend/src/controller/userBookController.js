import UserBook from "../models/UserBook.js";
import Book from "../models/Book.js";

export async function addBookToUser(req, res) {
    try {

        const { 
            title,
            author,
            description,
            genre,
            pageCount,
            publishedYear,
            isbn,
            coverImage,
            status, 
        } = req.body;

        let book = await Book.findOne({ isbn });

        if (!book) {
             book = await Book.create({
                title,
                author,
                description,
                genre,
                pageCount,
                publishedYear,
                isbn,
                coverImage,
            });

        }

        let userBook = await UserBook.findOne({
            user: req.user._id,
            book: book._id,
        });

        if (userBook) {

            userBook.status = status;

            if (status === "completed") {
                userBook.currentPage = book.pageCount;
            }

            await userBook.save();

            return res.status(200).json({
                message: "Book status updated successfully.",
                userBook,
            });

        }

        userBook = await UserBook({
            user: req.user._id,
            book: book._id,
            status,
        });

        if (status === "completed") {
            userBook.currentPage = book.pageCount;
        }

        await userBook.save();

        res.status(201).json({
            message: "Book added successfully.",
            userBook,
        });

    } catch (error) {
    console.error(error);

    res.status(500).json({
        message: "Internal Server Error",
        error: error.message
    });
}
}

export async function getReadingBooks(req, res) {
    try {

        const books = await UserBook.find({
            user: req.user._id,
            status: "reading",
        })
        .populate("book")
        .populate("user", "username, name, surname, profileImage");

        res.status(200).json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function getWishlistBooks(req, res) {
    try {

        const books = await UserBook.find({
            user: req.user._id,
            status: "wishlist",
        }).populate("book");

        res.status(200).json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function getLibraryBooks(req, res) {
    try {

        const books = await UserBook.find({
            user: req.user._id,
            status: "completed",
        }).populate("book");

        res.status(200).json(books);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function updateBookStatus(req, res) {
    try {

        const { status } = req.body;

        const userBook = await UserBook.findOne({
            _id: req.params.id,
            user: req.user._id,
    });

    if (!userBook) {
        return res.status(404).json({
            message: "Book not found",
        });
    }

    userBook.status = status;

    await userBook.save();

    res.status(200).json(userBook);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function updateReadingProgress(req, res) {
    try {

        const userBook = await UserBook.findByIdAndUpdate(
            req.params.id,
            {
                currentPage: req.body.currentPage,
            },
            {
                new: true,
            }
        );

        res.status(200).json(userBook);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function deleteBook(req, res) {
    try {

       const deleteBook = await UserBook.findByIdAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    if(!deletedBook) {
        return res.status(404).json({
            message: "Book not found",
        })
    }

        res.status(200).json({
            message: "Book removed successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });

    }
}

export async function updateCurrentPage(req, res) {
    try {

        const { currentPage } = req.body;

        const userBook = await UserBook.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("book");

        if (!userBook) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        if (
            currentPage < 0 ||
            currentPage > userBook.book.pageCount
        ) {
            return res.status(400).json({
                message: "Invalid page number."
            });
        }

        userBook.currentPage = currentPage;

        await userBook.save();

        res.status(200).json(userBook);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }
}

export async function markBookAsComplete(req, res) {
    try {
        const userBook = await UserBook.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("book");

        if(!userBook) {
            return res.status(404).json({
                message: "Book not found."
            });
        }

        userBook.status = "completed";
        userBook.currentPage = userBook.book.pageCount;

        await userBook.save();

        res.status(200).json(userBook);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export async function getCompletedBooks(req,res) {
    try {
        const books = await UserBook.find({
            user: req.user._id,
            status: "completed",
        }).populate("book");

        res.status(200).json(books);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error."
        });
    }
}

export async function moveBookToReading(req, res) {
    try {
        const userBook = await UserBook.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!userBook) {
            return res.status(404).json({
                message: "Book not found",
            });
        }

        userBook.status = "reading";
        userBook.currentPage = 0;

        await userBook.save();

        res.status(200).json(userBook);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

export async function updateRating(req, res) {
    try {
        const { rating } = req.body;

        if (rating < 0 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }

        const userBook = await UserBook.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if(!userBook) {
            return res.status(404).json({
                message: "Book Not Found",
            });
        }

        userBook.rating = rating;

        await userBook.save();

        res.status(200).json(userBook);

    } catch (error) {
        console.error(error);
    }
}

export async function removeBook(req, res) {
    try {

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error",
        })
    }
}
