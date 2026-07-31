import { useState, useContext } from "react";
import { createPost } from "../services/postService";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
  title: "",
  content: "",
  image: "",
});

const { user } = useContext(AuthContext);

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const data = await createPost(formData);

        console.log(data);

        navigate("/");
    } catch (error) {
        console.error(error);

        toast.error(
            error.response?.data?.message || "Failed to create post"
        );
    }
};

const navigate = useNavigate();

return (
    <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
            <div className="card-body">
                 <div className="mb-6 text-center">
                    <h2 className="text-3xl font-bold">
                        Create New Post
                    </h2>
                    
                    <p className="text-base-content/70 mt-2">
                        Share your thoughts with everyone.
                    </p>

                    <p>
                        Posting as {" "}
                        <Link
                        to="/createPost"
                        className="font-semibold">
                            @{user?.username}
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">  
                                <span className="label-text">
                                    Title
                                </span>
                            </label>
                            
                            <input
                            type="text"
                            name="title"
                            placeholder="Enter post title"
                            className="input input-bordered w-full"
                            value={formData.title}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Content
                                </span>
                            </label>
                            
                            <textarea
                            name="content"
                            placeholder="What's on your mind?"
                            className="textarea textarea-bordered w-full h-40"
                            value={formData.content}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <div>
                            <label className="label">
                                <span className="label-text">
                                    Image URL (Optional)
                                </span>
                            </label>
                            
                            <input
                            type="text"
                            name="image"
                            placeholder="https://..."
                            className="input input-bordered w-full"
                            value={formData.image}
                            onChange={handleChange}
                            />
                        </div>
                        
                        <button
                        type="submit"
                        className="btn btn-primary w-full"
                        >
                            Publish
                        </button>

                    </form>
                </div>
            </div>
        </div>
    </div>
 
)

}

export default CreatePostPage;
