import { X } from "lucide-react";

const BookSearchModal = ({ show, onClose }) => {
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
                    />

                <div className="mt-8 text-center opacity-60">
                    Search a book from Google Books
                </div>
            </div>
        </div>
    )
}

export default BookSearchModal