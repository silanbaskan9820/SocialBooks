import { Link } from "react-router-dom";

const FollowingModal = ({
    show,
    following,
    onClose,
}) => {

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            onClick={onClose}
        >

            <div
                className="bg-base-100 rounded-xl w-96 max-h-[500px] overflow-y-auto p-5"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-xl font-bold">
                        Following
                    </h2>

                    <button
                        className="btn btn-sm btn-circle"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                {following.length === 0 ? (

                    <p className="text-center opacity-60">
                        Not following anyone yet.
                    </p>

                ) : (

                    following.map((user) => (

                        <Link
                            key={user._id}
                            to={`/profile/${user._id}`}
                            className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition"
                            onClick={onClose}
                        >

                            <img
                                src={
                                    user.profileImage
                                        ? `http://localhost:5002${user.profileImage}`
                                        : "/avatar.png"
                                }
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div>

                                <p className="font-semibold">
                                    {user.name} {user.surname}
                                </p>

                                <p className="text-primary text-sm">
                                    @{user.username}
                                </p>

                            </div>

                        </Link>

                    ))

                )}

            </div>

        </div>
    );
};

export default FollowingModal;