import { useEffect, useState } from "react"
import { getCompletedBooks, 
         moveBookToReading, 
         removeBook, 
         updateRating 
} from "../../services/userBookService"
import { Star } from "lucide-react";

const LibraryTab = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [hoverRating, setHoverRating] = useState({});

    useEffect(() => {
        const fetchBooks = async () =>  {
            try {
                const data = await getCompletedBooks();

                setBooks(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-20">
                Loading...
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-20">

                <h2 className="text-3xl font-bold">
                    📚 Library
                </h2>

                <p className="opacity-60 mt-3">
                    No completed books yet.
                </p>

            </div>
        );
    }

    const handleReadAgain = async (id) => {
        try {
            await moveBookToReading(id);

            setBooks(prev => prev.filter(book => book._id !== id));

        } catch (error) {
            console.error(error);
        }
    }

    const handleRemove = async (id) => {

        const confirmed = window.confirm("Remove this book from your library?")

        if (!confirmed) return;

        try {
            await removeBook(id);

            setBooks(prev => prev.filter(book => book._id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    const handleRating = async (bookId, rating) => {

        const currentBook = books.find(book => book._id === bookId);

        const newRating = currentBook.rating === rating ? 0 : rating;
        try {
            await updateRating(bookId, rating);

            setBooks(prev => prev.map(book => book._id === bookId
                ? {...book, rating: newRating,}
                : book
            ))
        } catch (error) {
            console.error(error);
        }
    }

    return (
       <div>

            <h2 className="text-3xl font-bold mb-8">
                📚 Library
            </h2>

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
                                    📕
                                </div>

                            )}

                        </figure>

                        <div className="card-body">

                            <h2 className="card-title">
                                {item.book.title}
                            </h2>

                            <p>
                                {item.book.author}
                            </p>

                            
                            <div className="mt-4">
                                
                                <div className="flex items-center gap-1">

                                    {[1,2,3,4,5].map((star) => (
                                        
                                        <button
                                            key={star}
                                            onMouseEnter={() =>
                                                setHoverRating({
                                                    ...hoverRating,
                                                    [item._id]: star,
                                                })
                                            }
                                            onMouseLeave={() =>
                                                setHoverRating({
                                                    ...hoverRating,
                                                    [item._id]: 0,
                                                })
                                            }
                                            onClick={() => handleRating(item._id, star)}
                                            className="transition-transform hover:scale-125"
                                        >
                                            
                                            <Star
                                            size={22}
                                            className={
                                                star <= (hoverRating[item._id] || item.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }
                                            />
                                            
                                            </button>
                                        ))}
                                        
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 mt-2">
                                        Your Rating:{" "}
                                        <span className="font-semibold">
                                            {item.rating || "Not rated"}
                                        </span>
                                    </p>
                                    
                                </div>

                            <div className="badge badge-success">
                                ✔ Completed
                            </div>

                            <p className="text-sm mt-3">
                                ⭐ {item.rating || "No rating"}
                            </p>

                            <div className="flex justify-between mt-5">

                                <button 
                                   className="btn btn-outline btn-sm"
                                   onClick={() => handleReadAgain(item._id)}
                                >
                                    Read Again
                                </button>

                                <button 
                                    className="btn btn-error btn-sm"
                                    onClick={() => handleRemove(item._id)}
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}

export default LibraryTab