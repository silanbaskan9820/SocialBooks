import { Link } from "react-router-dom";
import { Heart, Eye, Calendar } from "lucide-react";
import { likePost } from "../../services/postService";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext} from "../../context/AuthContext";
import toast from "react-hot-toast"

const PostCard = ({ post }) => {

  console.log(post);

    const { user: currentUser } = useContext(AuthContext);

    const [likes, setLikes] = useState(post.likes.length);

    const [liked, setLiked] = useState(
        post.likes.some(
            (like) => like._id === currentUser?._id
        )
    );

    const handleLike = async () => {
      if (!currentUser) {
          toast.success("Please login first.");
          return;
        }

    try {

        const data = await likePost(post._id);

        setLikes(data.likesCount);
        setLiked(data.liked);

    } catch (error) {

        console.error(error);

    }
};

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

      <div className="card-body">

        <div className="flex items-start justify-between">
          <div>

    {post.author && (
              <Link
            to={`/profile/${post.author._id}`}
            className="flex items-center gap-3 mt-2"
            >
              <img
              src={
                post.author.profileImage
                ? `http://localhost:5002${post.author.profileImage}`
                : "/avatar.png"
              }
              className="w-14 h-14 rounded-full object-cover"
              />

           <div>
            <p className="text-sm text-gray-500">
        Author ✍️
    </p>
            <p className="font-semibold">
                {post.author.name} {post.author.surname}
            </p>

            <p className="text-primary text-sm">
                @{post.author.username}
            </p>
        </div>
        </Link>
    )}
        </div>

          <div className="flex items-center gap-2 text-sm opacity-70">
            <Calendar size={14} />
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

        <Link
        to={`/posts/${post._id}`}
        className="text-2xl font-semibold mt-2 hover:text-primary block"
        >
          {post.title}
        </Link>

        <p className="mt-2 whitespace-pre-line">
          {post.content}
        </p>

        {post.image && (

          <img
            src={post.image}
            alt={post.title}
            className="rounded-lg mt-4"
          />

        )}

        <div className="flex items-center gap-6 mt-5">

          <button
    onClick={handleLike}
    className="flex items-center gap-2 hover:text-red-500 transition-all">

    <Heart size={18} className={`transition-all ${liked ? "fill-red-500 text-red-500 scale-110": ""}`}/>

    <span>{likes}</span>
</button>
          <div className="flex items-center gap-2 hover: text-black-600 transition-all">

            <Eye size={18} />

            <span>{post.views}</span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default PostCard;