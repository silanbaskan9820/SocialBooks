import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchUsers, searchPosts } from "../services/searchService";

const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const fetchResults = async () => {

        if (!initialQuery.trim()) {
            setUsers([]);
            setPosts([]);
            return;
        }

        try {
            setLoading(true);

            const [users, posts] = await Promise.all([
    searchUsers(initialQuery),
    searchPosts(initialQuery),
]);

setUsers(users);
setPosts(posts);

        } catch (error) {
            console.error(error);

        } finally {
            setLoading(false);
        }
    };

    fetchResults();

}, [initialQuery]);

    const handleSearch = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        navigate(`/search?q=${query}`);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">

            <div className="mb-8">

                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Search className="text-primary" />
                    Search
                </h1>

                <p className="text-base-content/70 mt-2">
                    Results for{" "}
                    <span className="font-semibold text-primary">
                        "{initialQuery}"
                    </span>
                </p>

            </div>

            <form
                onSubmit={handleSearch}
                className="flex gap-3 mb-10"
            >

                <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="Search users or posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Search
                </button>

            </form>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            )}

            {!loading && users.length === 0 && posts.length === 0 && (
                <div className="bg-base-200 rounded-2xl py-20 text-center">

                    <Search
                        size={60}
                        className="mx-auto opacity-40 mb-4"
                    />

                    <h2 className="text-2xl font-bold">
                        No results found
                    </h2>

                    <p className="opacity-60 mt-2">
                        Try another keyword.
                    </p>

                </div>
            )}

            {users.length > 0 && (
                <section className="mb-12">

                    <h2 className="text-2xl font-bold mb-5">
                        👤 Users ({users.length})
                    </h2>

                    <div className="grid md:grid-cols-2 gap-5">

                        {users.map((user) => (

                            <Link
                                key={user._id}
                                to={`/profile/${user._id}`}
                                className="bg-base-100 rounded-2xl shadow hover:shadow-xl transition p-5 flex items-center gap-5"
                            >

                                <img
                                    src={
                                        user.profileImage
                                            ? `http://localhost:5002${user.profileImage}`
                                            : "/avatar.png"
                                    }
                                    alt={user.username}
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/avatar.png";
                                    }}
                                />

                                <div className="flex-1">

                                    <h3 className="font-bold text-lg">
                                        {user.name} {user.surname}
                                    </h3>

                                    <p className="text-primary">
                                        @{user.username}
                                    </p>

                                    <p className="text-sm opacity-60 mt-1 line-clamp-2">
                                        {user.bio || "No bio yet."}
                                    </p>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>
            )}

            {/* POSTS */}
            {posts.length > 0 && (
                <section>

                    <h2 className="text-2xl font-bold mb-5">
                        📚 Posts ({posts.length})
                    </h2>

                    <div className="space-y-5">

                        {posts.map((post) => (

                            <Link
                                key={post._id}
                                to={`/posts/${post._id}`}
                                className="block bg-base-100 rounded-2xl shadow hover:shadow-xl transition"
                            >

                                <div className="p-6">

                                    <div className="flex items-center gap-3 mb-4">

                                        <img
                                            src={
                                                post.author?.profileImage
                                                    ? `http://localhost:5002${post.author.profileImage}`
                                                    : "/avatar.png"
                                            }
                                            alt={post.author?.username}
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/avatar.png";
                                            }}
                                        />

                                        <div>

                                            <p className="font-semibold">
                                                {post.author?.username}
                                            </p>

                                            <p className="text-xs opacity-60">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>

                                        </div>

                                    </div>

                                    <h3 className="text-xl font-bold">
                                        {post.title}
                                    </h3>

                                    <p className="mt-3 opacity-80 line-clamp-3">
                                        {post.content}
                                    </p>

                                    <div className="flex gap-6 mt-5 text-sm opacity-70">

                                        <span>
                                            ❤️ {post.likes?.length || 0}
                                        </span>

                                        <span>
                                            👁 {post.views || 0}
                                        </span>

                                        <span>
                                            💬 {post.comments?.length || 0}
                                        </span>

                                    </div>

                                </div>

                            </Link>

                        ))}

                    </div>

                </section>
            )}

        </div>
    );
};

export default SearchPage;