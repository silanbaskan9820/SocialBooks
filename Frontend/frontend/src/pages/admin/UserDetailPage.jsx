import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAdminUserDetail } from "../../services/adminService";
import { updateUserRole } from "../../services/adminService";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";

const UserDetailPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    const { user: currentUser } = useContext(AuthContext);

    const [selectedRole, setSelectedRole] = useState("");
    const [updatingRole, setUpdatingRole] = useState(false);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const data = await getAdminUserDetail(id);

                //console.log("USER DETAIL DATA:", data);

                setUser(data.user);
                setPosts(data.posts || []);
                setComments(data.comments || []);
                setSelectedRole(data.user.role);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [id]);

    useEffect(() => {
    console.log("USER OBJECT:", user);
}, [user]);

    if (loading) {
        return (
            <div className="flex justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6">
                <p>User not found.</p>
            </div>
        );
    }

    const handleRoleUpdate = async () => {

        if(selectedRole === user.role) {
            toast.error("No role change detected.");
            return;
        }

        try{
            setUpdatingRole(true);

            const data = await updateUserRole(user._id, selectedRole);

            setUser(prev => ({...prev, role: data.user.role}));

            toast.success("User role updated successfully.");

        } catch (error) {
            console.error(error);

            toast.error(error.response?.data?.message || "Failed to update user role.");
        } finally {
            setUpdatingRole(false);
        }
    }

    return (
        <div>

            <button
                className="btn btn-ghost mb-6"
                onClick={() => navigate("/admin/users")}
            >
                <ArrowLeft size={18} />
                Back to Users
            </button>

            <h1 className="text-3xl font-bold mb-6">
                User Details
            </h1>

            <div className="card bg-base-100 shadow-md">

                <div className="card-body">

                    <div className="flex items-center gap-4">

                        <img
                            src={
                                user.profileImage
                                    ? `http://localhost:5002${user.profileImage}`
                                    : "/avatar.png"
                            }
                            alt={user.username}
                            className="w-20 h-20 rounded-full object-cover"
                        />

                        <div>
                            <h2 className="text-2xl font-bold">
                                {user.username}
                            </h2>

                            <p className="opacity-60">
                                {user.name} {user.surname}
                            </p>

                            <p className="text-sm opacity-60">
                                {user.email}
                            </p>
                        </div>

                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div>
                            <p className="text-sm opacity-60">
                                Role
                            </p>
                            <p className="font-semibold">
                                {user.role}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Status
                            </p>
                            <p className="font-semibold">
                                {user.isBanned ? "Banned" : "Active"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Privacy
                            </p>
                            <p className="font-semibold">
                                {user.privacy?.privateAccount
                                    ? "Private"
                                    : "Public"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Language
                            </p>
                            <p className="font-semibold">
                                {user.language}
                            </p>
                        </div>

                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                        <div>
                            <p className="text-sm opacity-60">
                                Followers
                            </p>
                            <p className="text-2xl font-bold">
                                {user.followersCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Following
                            </p>
                            <p className="text-2xl font-bold">
                                {user.followingCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Posts
                            </p>
                            <p className="text-2xl font-bold">
                                {user.postsCount}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm opacity-60">
                                Comments
                            </p>
                            <p className="text-2xl font-bold">
                                {user.commentsCount}
                            </p>
                        </div>

                    </div>

                </div>

                <div className="divider"></div>

                {currentUser?.role === "superadmin" && (
    <div className="card bg-base-100 shadow-md mt-6">

        <div className="card-body">

            <h2 className="card-title">
                Role Management
            </h2>

            <p className="text-sm opacity-60">
                Change this user's system role.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">

                <select
                    className="select select-bordered"
                    value={selectedRole}
                    onChange={(e) =>
                        setSelectedRole(e.target.value)
                    }
                    disabled={
                        user.role === "superadmin"
                    }
                >

                    <option value="user">
                        User
                    </option>

                    <option value="admin">
                        Admin
                    </option>

                    <option value="superadmin">
                        Super Admin
                    </option>

                </select>

                <button
                    className="btn btn-primary"
                    onClick={handleRoleUpdate}
                    disabled={
                        updatingRole ||
                        selectedRole === user.role ||
                        user.role === "superadmin"
                    }
                >

                    {updatingRole ? (
                        <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Updating...
                        </>
                    ) : (
                        "Update Role"
                    )}

                </button>

            </div>

        </div>

    </div>
)}

            </div>

            <div className="divider"></div>

          <div className="card bg-base-100 shadow-md mt-6">

    <div className="card-body">

        <h2 className="card-title">
            User Posts
        </h2>

        {posts.length === 0 ? (

            <p className="text-center opacity-60 py-6">
                This user has no posts.
            </p>

        ) : (

            <div className="space-y-4">

                {posts.map((post) => (

                    <div
                        key={post._id}
                        className="border rounded-xl p-4 hover:bg-base-200 transition"
                    >

                        <h3 className="font-bold text-lg">
                            {post.title}
                        </h3>

                        <p className="text-sm opacity-70 mt-2">
                            {post.content}
                        </p>

                        <div className="flex gap-4 mt-4 text-sm opacity-60">

                            <span>
                                ❤️ {post.likes?.length || 0}
                            </span>

                            <span>
                                👁️ {post.views || 0}
                            </span>

                            <span>
                                {post.createdAt
                                    ? new Date(
                                        post.createdAt
                                    ).toLocaleDateString()
                                    : ""}
                            </span>

                        </div>

                    </div>

                ))}

            </div>

        )}

    </div>

</div>  

<div className="divider"></div>

<div className="card bg-base-100 shadow-md mt-6">

    <div className="card-body">

        <h2 className="card-title">
            User Comments
        </h2>

        {comments.length === 0 ? (

            <p className="text-center opacity-60 py-6">
                This user has no comments.
            </p>

        ) : (

            <div className="space-y-4">

                {comments.map((comment) => (

                    <div
                        key={comment._id}
                        className="border rounded-xl p-4 hover:bg-base-200 transition"
                    >

                        <p className="text-sm">
                            {comment.text || comment.comment}
                        </p>

                        <div className="text-xs opacity-50 mt-3">

                            {comment.createdAt
                                ? new Date(
                                    comment.createdAt
                                ).toLocaleDateString()
                                : ""}

                        </div>

                    </div>

                ))}

            </div>

        )}

    </div>

</div>

        </div>
    );
};

export default UserDetailPage;