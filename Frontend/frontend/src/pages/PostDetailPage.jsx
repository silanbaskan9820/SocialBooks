import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost, likePost } from "../services/postService";
import { likeComment } from "../services/commentService";
import { AuthContext } from "../context/AuthContext";
import { getCommentsByPost, createComment, updateComment, deleteComment } from "../services/commentService";
import { Calendar, Heart } from "lucide-react"
import toast from "react-hot-toast"

const PostDetailPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingCommentId, setEditingCommentId] = useState(null);
  
  const [editCommentText, setEditCommentText] = useState("");

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [showLikes, setShowLikes] = useState(false);

  const handleDelete = async () => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {

        await deletePost(id);

        navigate("/");

    } catch (error) {

        console.error(error);

        toast.error("Post could not be deleted.");

    }

};

const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    try {

        const newComment = await createComment({
            content: commentText,
            post: id,
        });

        setComments([newComment, ...comments]);

        setCommentText("");

    } catch (error) {

        console.error(error);

        toast.error("Comment could not be added.");

    }
};

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);

        setPost(data.post);

        setLikesCount(data.post.likes.length);

if (user) {
    setLiked(
        data.post.likes.some(
            likeUser => likeUser._id === user._id
        )
    );
  }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
    try {

        const data = await getCommentsByPost(id);

        setComments(data);

    } catch (error) {

        console.error(error);

    }
};

    fetchPost();
    fetchComments();
  }, /*[id]*/);

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        Post not found.
      </div>
    );
  }

  console.log(comments);

const handleCommentDelete = async (commentId) => {

    const confirmed = window.confirm(
        "Are you sure you want to delete this comment?"
    );

    if (!confirmed) return;

    try {

        await deleteComment(commentId);

        setComments(
            comments.filter(
                (comment) => comment._id !== commentId
            )
        );

    } catch (error) {

        console.error(error);

        toast.error("Comment could not be deleted.");

    }
};

const handleCommentUpdate = async (commentId) => {

    if (!editCommentText.trim()) return;

    try {

        const updatedComment = await updateComment(commentId, {
            content: editCommentText,
        });

        setComments(
            comments.map((comment) =>
                comment._id === commentId
                    ? updatedComment
                    : comment
            )
        );

        setEditingCommentId(null);
        setEditCommentText("");

    } catch (error) {

        console.error(error);

        toast.error("Comment could not be updated.");

    }

};

const handleLike = async () => {
    try{

        const data = await likePost(post._id);

        setLiked(data.liked);

        setLikesCount(data.likesCount);

    }catch(error){
        console.error(error);
    }
}

const handleLikeComment = async (commentId) => {
  console.log("Comment ID: ", commentId);
  console.log("User:", user);
  console.log("Comment:", commentId);

  try {
    const data = await likeComment(commentId);

    if (!user) {
    console.log("User is undefined");
    return;
}

    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id !== commentId) return comment;

        return {
          ...comment,
          likes: data.liked
          ? [...comment.likes, user._id]
          : comment.likes.filter(
            (id) => id.toString() !== user._id.toString()
          ),
         };
  })
    );

  } catch (error) {
    console.error(error);
  }
}

 return (
  <div className="max-w-3xl mx-auto p-6">

    <div className="card bg-base-100 shadow-md">

      <div className="card-body">

        <div className="flex justify-between items-center">

          <h2 className="font-bold text-primary">
            <Link 
            to={`/profile/${post.author?._id}`}
            className="font-bold text-primary hover:underline">
              @{post.author?.username}
            </Link>
          </h2>

          <div className="flex items-center gap-2 text-sm opacity-70">
            <Calendar size={14} />
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

        </div>

        <h1 className="text-4xl font-semibold mt-3">
          {post.title}
        </h1>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="rounded-lg mt-5"
          />
        )}

        <p className="mt-5 whitespace-pre-line">
          {post.content}
        </p>

        <div className="flex gap-6 mt-6 text-lg">

          <button
    className="btn btn-ghost gap-2"
    onClick={handleLike}
>
<Heart
size={18}
    fill={liked ? "red" : "none"}
    color="red"
/>
</button>

<button 
className="btn btn-link p-0"
onClick={() => setShowLikes(true)}>
  {likesCount} Likes
</button>
          <span>
            👁 {post.views}
          </span>

        </div>

        {user?._id === post.author?._id && (
          <div className="flex gap-3 mt-8">

            <Link
              to={`/posts/edit/${post._id}`}
              className="btn btn-warning"
            >
              Edit
            </Link>

            <button
              onClick={handleDelete}
              className="btn btn-error"
            >
              Delete
            </button>

          </div>
        )}

        <hr className="my-6" />

        <h3 className="text-2xl font-semibold mb-4 text-center">
          Comments
        </h3>

        <div className="mt-6">

          {comments.length === 0 ? (

            <p className="text-gray-500">
              No comments yet.
            </p>

          ) : (

            comments.map((comment) => (

              <div
                key={comment._id}
                className="border rounded-lg p-4 mb-3"
              >

                <div className="flex justify-between items-center">

                  <Link
                  to={`/profile/${comment.author?._id}`}
                  className="font-semibold text-primary hover:underline"
                  >
                    @{comment.author?.username}
                  </Link>
                  
                  {user?._id === comment.author?._id && (

                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          setEditingCommentId(comment._id);
                          setEditCommentText(comment.content);
                        }}
                        className="btn btn-warning btn-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleCommentDelete(comment._id)}
                        className="btn btn-error btn-xs"
                      >
                        Delete
                      </button>

                    </div>

                  )}

                </div>

                {editingCommentId === comment._id ? (

    <>
        <textarea
            className="textarea textarea-bordered w-full mt-3"
            value={editCommentText}
            onChange={(e) =>
                setEditCommentText(e.target.value)
            }
        />

        <div className="flex gap-2 mt-3">

            <button
                onClick={() => handleCommentUpdate(comment._id)}
                className="btn btn-success btn-sm"
            >
                Save
            </button>

            <button
                onClick={() => {
                    setEditingCommentId(null);
                    setEditCommentText("");
                }}
                className="btn btn-ghost btn-sm"
            >
                Cancel
            </button>

        </div>

    </>

) : (

    <p className="mt-3">
        {comment.content}
    </p>

)}

<div className="flex items-center gap-2 mt-2">
  <button
  onClick={() => handleLikeComment(comment._id)}
  className="btn btn-ghost gap-2"
  >
    <Heart 
    size={18}
    fill={
      comment.likes?.includes(user._id) 
      ? "red" 
      : "none"}
    color="red"
    />

    <span>{comment.likes?.length || 0}</span>
  </button>
</div>

                <p className="text-xs text-gray-500 mt-2 text-right">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>

              </div>

            ))

          )}

        </div>

        <form
          onSubmit={handleCommentSubmit}
          className="space-y-3"
        >

          <textarea
            className="textarea textarea-bordered w-full"
            rows="3"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Add Comment
          </button>

        </form>

        {showLikes && (

<div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowLikes(false)}
>

<div
    className="bg-base-100 rounded-xl p-5 w-96 max-h-500px overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
>

<h2 className="text-xl font-bold mb-4">
Liked By
</h2>

{post.likes.length === 0 ? (

<p>No likes yet.</p>

) : (

post.likes.map((user) => (

<Link
    key={user._id}
    to={`/profile/${user._id}`}
    className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition duration-200"
    onClick={() => setShowLikes(false)}
>

<img
    src={
        user.profileImage
            ? `http://localhost:5002${user.profileImage}`
            : user.profileImage || "https://placehold.co/120x120"
    }
    className="w-10 h-10 rounded-full object-cover"
/>

<p className="font-semibold">
    @{user.username}
</p>

</Link>

))

)}

</div>

</div>

)}

      </div>

    </div>

  </div>
);
}
export default PostDetailPage;