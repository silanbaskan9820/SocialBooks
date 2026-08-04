import { useEffect, useState } from "react"
import { getCompletedBooks } from "../../services/userBookService"

const LibraryTab = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

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

                            <div className="badge badge-success">
                                ✔ Completed
                            </div>

                            <p className="text-sm mt-3">
                                ⭐ {item.rating || "No rating"}
                            </p>

                            <div className="flex justify-between mt-5">

                                <button className="btn btn-outline btn-sm">
                                    Read Again
                                </button>

                                <button className="btn btn-error btn-sm">
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