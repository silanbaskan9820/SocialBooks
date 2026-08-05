import { useState, useEffect } from "react";
import { getReadingBooks, updateCurrentPage, markBookAsCompleted } from "../../services/userBookService";

const ReadingTab = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pageInputs, setPageInputs] = useState({});

useEffect(() => {

    const fetchReadingBooks = async () => {

        try {

            const data = await getReadingBooks();

            //console.log(data);

            setBooks(data);

            const pages = {};
            
            data.forEach((book) => {
                pages[book._id] = book.currentPage;
            });
            
            setPageInputs(pages);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    fetchReadingBooks();

}, []);

if (loading) {
    return (
        <div className="text-center py-20">
            Loading...
        </div>
    )
}

if (books.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-3xl font-bold" >
                📖 Reading
            </h2>

            <p className="opacity-60 mt-3">
                No books yet.
            </p>
        </div>
    );
}

const handleUpdatePage = async (id, currentPage) => {

    try {

        const updatedBook = await updateCurrentPage(id, currentPage);

        setBooks(prev =>
            prev.map(book =>
                book._id === id
                    ? updatedBook
                    : book
            )
        );

        setPageInputs(prev => ({
            ...prev,
            [id]: updatedBook.currentPage,
        }));

    } catch (error) {

        console.error(error);

    }

};

const handleCompleteBook = async (id) => {
    try {
        await markBookAsCompleted(id);

        setBooks(prev => prev.filter(book => book._id !== id));

    } catch (error) {
        console.error(error);
    }
}
    return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

        {books.map((item) => {

            const progress =
                Math.round(
                    (item.currentPage / item.book.pageCount) * 100
                ) || 0;

                <div className="mt-4 flex gap-2">
                    
                    <input
                       type="number"
                       min="0"
                       max={item.book.pageCount}
                       value={pageInputs[item._id] ?? 0}
                       onChange={(e) =>
                        setPageInputs({
                            ...pageInputs,
                            [item._id]: Number(e.target.value),
                        })
                      }
                       className="input input-bordered input-sm w-24"
                    />
                    
                    <button
                       className="btn btn-primary btn-sm"
                       onClick={() => {
                        const value = document.getElementById(
                            `page-${item._id}`
                        ).value;
                       handleUpdatePage(item._id, value);
                       }}
                    >
                        Update
                    </button>
                    
                </div>

            return (

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

                        <p className="opacity-70">
                            {item.book.author}
                        </p>

                        <div className="badge badge-primary">
                            {item.book.genre}
                        </div>
                        
                        <div className="mt-4">
                            
                            <div className="flex justify-between text-sm">

                                <span>
                                    {item.currentPage} / {item.book.pageCount}
                                </span>
                                
                                <span>
                                    {progress}%
                                </span>

                        </div>
                        
                        <progress
                            className="progress progress-primary w-full mt-2"
                            value={progress}
                            max="100"
                        />
                        
                        <div className="flex items-center gap-3 mt-4">
                            
                            <button
                               className="btn btn-square btn-sm"
                               onClick={() => {
                                const newPage = Math.max(
                                    0,
                                    (pageInputs[item._id] ?? 0) - 1
                                );

                                setPageInputs({
                                    ...pageInputs,
                                    [item._id]: newPage
                                });
                                handleUpdatePage(item._id, newPage);
                                }}
                            >
                                -
                            </button>
                            
                            <input
                               type="number"
                               className="input input-bordered input-sm w-20 text-center"
                               value={pageInputs[item._id] ?? 0}
                               onChange={(e) =>
                                setPageInputs({
                                    ...pageInputs,
                                    [item._id]: Number(e.target.value),
                                })
                               }
                            />
                            
                            <button
                               className="btn btn-square btn-sm"
                               onClick={() => {
                                const newPage = Math.min(
                                    item.book.pageCount,
                                    (pageInputs[item._id] ?? 0) + 1
                                );
                                setPageInputs({
                                    ...pageInputs,
                                    [item._id]: newPage
                                });
                                handleUpdatePage(item._id, newPage)
                                }}
                            >
                                +
                            </button>
                            
                        </div>
                        
                        </div>

                        <div className="flex justify-between mt-5">

                            <button className="btn btn-outline btn-sm">
                                Continue Reading
                            </button>

                            <button 
                               className="btn btn-success btn-sm"
                               onClick={() => handleCompleteBook(item._id)}
                               >
                                Finished
                            </button>

                        </div>

                    </div>

                </div>

            );

        })}

    </div>
);
}

export default ReadingTab