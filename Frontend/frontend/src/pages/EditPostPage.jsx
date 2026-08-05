import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../services/postService";
import toast from "react-hot-toast"

const EditPostPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
});

const [loading, setLoading] = useState(true);

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        await updatePost(id, formData);

        navigate(`/posts/${id}`);

    } catch (error) {

       console.error(error);
    //console.log(error.response);
    //console.log(error.response?.data);


        toast.error("Post could not be updated.");

    }
};

useEffect(() => {

    const fetchPost = async () => {

        try {

            const data = await getPostById(id);

            setFormData({
                title: data.post.title,
                content: data.post.content,
                image: data.post.image || "",
            });

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    fetchPost();

}, [id]);

if (loading) {
    return <div>Loading...</div>;
}

 return (
    <div className="max-w-3xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-6">
            Edit Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

            <div>
                <label className="label">
                    <span className="label-text">
                        Title
                    </span>
                </label>

                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="input input-bordered w-full"
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
                    rows="6"
                    value={formData.content}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full"
                />
            </div>

            <div>
                <label className="label">
                    <span className="label-text">
                        Image URL
                    </span>
                </label>

                <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full"
            >
                Update Post
            </button>

        </form>

    </div>
);
};

export default EditPostPage;