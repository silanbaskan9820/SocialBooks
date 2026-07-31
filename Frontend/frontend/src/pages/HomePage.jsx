import { useEffect, useState } from "react";
import { getAllPosts } from "../services/postService";
import PostCard from "../components/post/PostCard";

const HomePage = () => {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const data = await getAllPosts();
                console.log(JSON.stringify(data, null, 2));

                setPosts(data);
                setLoading(false);

            } catch (error) {
                console.error(error);

                setError("Failed to load posts.");
            } finally {
              setLoading(false);
            }
        };

        fetchPosts();

    }, []);

    return (
  <div className="max-w-3xl mx-auto p-6">

    <h1 className="text-3xl font-semibold mt-5">
      Home
    </h1>

    {loading && (
      <p>Loading...</p>
    )}

    {error && (
      <p>{error}</p>
    )}

    {!loading &&
      posts.map((post) => (
    <PostCard
        key={post._id}
        post={post}
    />
))
    }

  </div>
);
};

export default HomePage;