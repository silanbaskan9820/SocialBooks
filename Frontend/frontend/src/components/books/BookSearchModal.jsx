import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { searchBooks } from "../../services/bookService";
import { addBookToUser } from "../../services/userBookService";
import toast from "react-hot-toast"

const BookSearchModal = ({ show, onClose }) => {

    const [query, setQuery] = useState("");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    const timer = setTimeout(async () => {
        const searchQuery = query.trim().replace(/\s+/g, "");

        // Boş arama
        if (!searchQuery) {
            setBooks([]);
            return;
        }

        // 2 karakterden kısa arama yapma
        if (searchQuery.length < 2) {
            setBooks([]);
            return;
        }

        try {
            setLoading(true);

            const data = await searchBooks(searchQuery);
            setBooks(data);
        } catch (error) {
            console.error("Book search error:", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    }, 400);

    return () => clearTimeout(timer);
}, [query]);

const handleAddBook = async (book, status) => {

    try {

        await addBookToUser({

            title: book.title,
            author: book.author,
            description: book.description,
            genre: book.genre,
            pageCount: book.pageCount,
            publishedYear: book.publishedYear,
            isbn: book.isbn,
            coverImage: book.coverImage,
            status,

        });

        toast.success("Book added successfully!");

        onClose();

    } catch (error) {

        console.error(error);

        toast.error("Book could not be added.");

    }

};

if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >

            <div
                className="bg-base-100 w-[700px] max-h-[85vh] rounded-xl shadow-xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        📚 Add Book
                    </h2>

                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-circle"
                    >
                        <X size={22} />
                    </button>

                </div>

                <input 
                    type="text"
                    placeholder="Search books..."
                    className="input input-bordered w-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    />

                    {loading && (
                        <div className="text-center mt-6">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    )}

                    <div className="mt-6 space-y-4">

    {books.map((book) => (

        <div
            key={book.openLibraryId}
            className="border rounded-xl p-4 flex gap-4 hover:bg-base-200 transition"
        >

            <div className="w-24 h-32 bg-base-200 rounded-lg overflow-hidden flex items-center justify-center">

                {book.coverImage ? (

                    <img
                        src={book.coverImage || "/default-book-cover.png"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {e.target.src = "/default-book-cover.png"}}
                    />

                ) : (

                    <span className="text-5xl">
                        📕
                    </span>

                )}

            </div>

            <div className="flex-1">

                <h2 className="font-bold text-lg">
                    {book.title}
                </h2>

                <p className="text-sm opacity-70">
                    {book.author}
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">

                    <div className="badge badge-primary">
                        {book.genre || "Unknown"}
                    </div>

                    <div className="badge badge-outline">
                        {book.pageCount} pages
                    </div>

                    <div className="badge badge-outline">
                        {book.publishedYear}
                    </div>

                </div>

                <p className="text-sm opacity-70 mt-3 line-clamp-3">

                    {book.description || "No description available."}

                </p>

                <div className="flex gap-2 mt-5">

                    <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleAddBook(book, "wishlist")}
                    >
                        ⭐ Wishlist
                    </button>

                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddBook(book, "reading")}
                    >
                        📖 Reading
                    </button>

                    <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleAddBook(book, "completed")}
                    >
                        ✔ Finished
                    </button>

                </div>

            </div>

        </div>

    ))}

</div>

                <div className="mt-8 text-center opacity-60">
                    Search a book from Open Library
                </div>
            </div>
        </div>
    )
}

export default BookSearchModal