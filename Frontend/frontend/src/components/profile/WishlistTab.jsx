import { useEffect, useState } from "react";
import { getWishlistBooks, updateBookStatus, deleteUserBook } from "../../services/userBookService";

const WishlistTab = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect (() => {
        const fetchBooks = async () => {
            try {
                const data = await getWishlistBooks();

                setBooks(data);
            } catch (error) {
            console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleStartReading = async (bookId) => {
        try {

            const data = await updateBookStatus(bookId, "reading");
            //console.log(data);

            setBooks(prev => prev.filter(book => book._id !== bookId));
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveBook = async (bookId) => {

        const confirmed = window.confirm("Remove this book from your wishlist?");

        if (!confirmed) return;

        try {
            await deleteUserBook(bookId);

            setBooks(prev => prev.filter(book => book._id !== bookId));
        } catch (error) {
            console.error(error);
        }
    }

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading...
            </div>
        )
    }

    return (
       <div className="mt-8">

        {books.length === 0 ? (
            <div className="text-center py-20">

                <h2 className="text-3xl font-bold">
                    ⭐ Wishlist
                </h2>

                <p className="opacity-60 mt-3">
                    No books yet.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {books.map((item) => (

                    <div
                        key={item._id}
                        className="card bg-base-100 shadow-xl"
                        >
                        <figure className="h-72 bg-base-200">
                            {item.book.coverImage ? (
                                <img
                                    src={item.book.coverImage}
                                    className="w-full h-full object-cover"
                                />

                            ) : (

                                <div className="text-7xl">
                                    📘
                                </div>
                            )}
                        </figure>

                        <div className="card-body">

                            <h2 className="card-title">
                                {item.book.title}
                            </h2>

                            <p className="opacity-70">
                                {item.book.author}
                            </p>

                            <div className="badge badge-secondary">
                                {item.book.genre}
                            </div>

                            <div className="flex justify-between mt-5">

                                <button 
                                   className="btn btn-primary btn-sm"
                                   onClick={() => handleStartReading(item._id)}
                                >
                                    📖 Start Reading
                                </button>

                                <button 
                                   className=" btn btn-error btn-sm"
                                   onClick={() => handleRemoveBook(item._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
       </div>
    )
}

export default WishlistTab;