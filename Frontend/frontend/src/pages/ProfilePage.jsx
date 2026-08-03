import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, updateUser, uploadProfilePhoto, getFollowers, getFollowing } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Camera, Check, Pencil, UserPlus, UserCheck, X } from "lucide-react";
import PostCard from "../components/post/PostCard";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("wall");

    const { user: currentUser, setUser: setCurrentUser } = useContext(AuthContext);

    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        username: "",
        name: "",
        surname: "",
        bio: "",
});

const [saving, setSaving] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(id);

                console.log("Profile Data:", data);

                setUser(data.user); // Backend sadece user döndürüyor

                setPosts(data.posts);  // Backend posts göndermediği için boş dizi

                if (currentUser) {
                    setIsFollowing(
                        data.user.followers.some(
                            follower =>
                                follower.toString() === currentUser._id
                        )
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, currentUser]);

    const isOwner = currentUser?._id === user?._id;

    const isFollower = user?.followers?.some( follower => follower.toString() === currentUser?._id);

    const canViewPrivateProfile = 
    !user?.privacy?.privateAccount ||
    isOwner || 
    isFollower;

    if (loading) {
        return (
            <div className="text-center mt-10">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center mt-10">
                User not found.
            </div>
        );
    }

    const handleFollow = async () => {
    try {
        const data = await followUser(user._id);

        setIsFollowing(data.following);

        setUser((prev) => ({
            ...prev,
            followers: data.following
                ? [...prev.followers, currentUser._id]
                : prev.followers.filter(
                    id => id !== currentUser._id
                )
        }));

    } catch (error) {
        console.error(error);
    }
};

const handleFollowers = async () => {
    try {
         const data = await getFollowers(user._id);

         console.log("Followers: ", data);
         
         setFollowers(data);
         setShowFollowers(true);

    } catch (error) {
        console.error(error);
        toast.error("Followers could not be loaded")
    }  
}

const handleFollowing = async () => {
    try {
        const data = await getFollowing(user._id);

    setFollowing(data);

    setShowFollowing(true);
    } catch (error) {
        console.error(error);
        toast.error("Following could not be loaded");
    }
    
}

const handleUserUpdate = async () => {

      setSaving(true);
    
        try {
    
            await updateUser(user._id, editForm);

            if(profileImage) {
                await uploadProfilePhoto(user._id, profileImage);
            }

            const data = await getUserProfile(user._id);
    
            setUser(data.user);
            setCurrentUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));

            setPosts(data.posts);

            setProfileImage(null);
            setPreviewImage("");
    
            setIsEditing(false);
            
            toast.success("Profile updated successfully!");
    
        } catch (error) {
    
            console.error(error);
    
            toast.error("Profile could not be updated.");
    
        } finally { 
            setSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">

            <div className="bg-base-100 rounded-xl shadow-lg p-8">

              <div className="card-body">

                <div className="flex justify-between items-start">

                    <div className="flex gap-6">

                        <div className="relative w-28 h-28">

    <img
        src={
            previewImage
                ? previewImage
                : user.profileImage
                ? `http://localhost:5002${user.profileImage}`
                : "/avatar.png"
        }
        alt={user.username}
        className="w-28 h-28 rounded-full object-cover"
    />

    {isEditing && (
        <>
            <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm"
            >
                <Camera size={18} />
            </label>

            <input
                id="profileImage"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files[0];

                    setProfileImage(file);

                    if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                    }
                }}
            />
        </>
    )}

</div>
                        <div>

                            {isEditing ? (

    <div className="space-y-4 mt-2">

        <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Username"
            value={editForm.username}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    username: e.target.value,
                })
            }
        />

        <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Name"
            value={editForm.name}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    name: e.target.value,
                })
            }
        />

        <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Surname"
            value={editForm.surname}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    surname: e.target.value,
                })
            }
        />

        <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Bio"
            value={editForm.bio}
            onChange={(e) =>
                setEditForm({
                    ...editForm,
                    bio: e.target.value,
                })
            }
        />

        <div className="flex gap-3">

            <button
                className="btn btn-success"
                onClick={handleUserUpdate}
                disabled={saving}
            >
                <Check size={18} />
                {saving ? "Saving..." : "Save"}
            </button>

            <button
                className="btn btn-outline"
                onClick={() => {setIsEditing(false);
                    setEditForm({
    username: user.username,
    name: user.name,
    surname: user.surname,
    bio: user.bio,
})
setProfileImage(null);
setPreviewImage("");
                }}
            >
                <X size={18} />
                Cancel
            </button>

        </div>

    </div>

) : (

    <>

        <h1 className="text-4xl font-bold">
            {user.name} {user.surname}
        </h1>

        <p className="text-primary text-lg mt-1">
            @{user.username}
        </p>

        <p className="mt-5 text-gray-500 italic">
    {user.bio || "No bio yet."}
</p>

    </>

)}

<div className="tabs tabs-boxed mt-10 justify-center">

  <button
    className={`tab ${activeTab === "wall" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("wall")}
  >
    📰 Wall
  </button>

  <button
    className={`tab ${activeTab === "reading" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("reading")}
  >
    📖 Reading
  </button>

  <button
    className={`tab ${activeTab === "wishlist" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("wishlist")}
  >
    ⭐ Wishlist
  </button>

  <button
    className={`tab ${activeTab === "library" ? "tab-active" : ""}`}
    onClick={() => setActiveTab("library")}
  >
    📚 Library
  </button>

</div>
                            {canViewPrivateProfile && (
                                
                                <div className="flex gap-6 mt-5 text-sm">
                                    
                                    <button
                                    onClick={handleFollowers}
                                    >
                                        <span>
                                        {user.privacy?.showFollowers ? (
                                            <>
                                            <strong>{user.followers.length}</strong> Followers
                                            </>
                                            
                                        ) : (
                                            "Followers Hidden"
                                        )}
                                    </span>
                                    </button>
                                    
                                    <button 
                                    onClick={handleFollowing}>
                                        <span>
                                        {user.privacy?.showFollowing ? (
                                            <>
                                            <strong>{user.following.length}</strong> Following
                                            </>
                                            
                                        ) : (
                                            "Following Hidden"
                                        )}
                                    </span>
                                    </button>
                                    
                                    
                                </div>
                            )}

                        </div>

                    </div>    

                    <div className="text-right">

                        <p className="text-gray-500 text-sm">
                            Joined{" "}
                            {new Date(user.createdAt).toLocaleDateString()
                                }
                        </p>

                        {currentUser &&
                        currentUser._id !== user._id && (
                        
                        <button
                        onClick={handleFollow}
                        className={`btn mt-4 ${
                            isFollowing
                            ? "btn-outline"
                            : "btn-primary"
                        }`}
                        >
                            {isFollowing ? (
                                <>
                                <UserCheck size={18}/>
                                Following
                                </>
                            ) : (
                                <> 
                                <UserPlus size={18} />
                                Follow
                                </>
                            )}
                        </button>
                    )}

                    {currentUser?._id === user._id && (
                        <button className="btn btn-warning mt-4"
                        onClick={() => {
                            setIsEditing(true);

                            setEditForm({
                                username: user.username || "",
                                name: user.name || "",
                                surname: user.surname || "",
                                bio: user.bio || "",
                            });
                        }}
                        >
                            <Pencil  size={18}/>
                            Edit Profile
                        </button>
                    )}

                    </div>

                </div>

            </div>

           {/* Followers Modal */}
{showFollowers && (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    onClick={() => setShowFollowers(false)}
  >
    <div
      className="bg-base-100 rounded-xl w-96 overflow-y-auto p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">
        Followers
      </h2>

      {followers.length === 0 ? (
        <p>No followers yet.</p>
      ) : (
        followers.map((user) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition"
            onClick={() => setShowFollowers(false)}
          >
            <img
              src={
                user.profileImage
                  ? `http://localhost:5002${user.profileImage}`
                  : "/avatar.png"
              }
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">
                {user.name} {user.surname}
              </p>

              <p className="text-primary">
                @{user.username}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
)}

{/* Following Modal */}
{showFollowing && (
  <div
    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
    onClick={() => setShowFollowing(false)}
  >
    <div
      className="bg-base-100 rounded-xl w-96 overflow-y-auto p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-4">
        Following
      </h2>

      {following.length === 0 ? (
        <p>Not following anyone yet.</p>
      ) : (
        following.map((user) => (
          <Link
            key={user._id}
            to={`/profile/${user._id}`}
            className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition"
            onClick={() => setShowFollowing(false)}
          >
            <img
              src={
                user.profileImage
                  ? `http://localhost:5002${user.profileImage}`
                  : "/avatar.png"
              }
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <p className="font-semibold">
                {user.name} {user.surname}
              </p>

              <p className="text-primary">
                @{user.username}
              </p>
            </div>
          </Link>
        ))
      )}
    </div>
  </div>
)}

<div className="tabs tabs-boxed justify-center mt-8">

    <button
        className={`tab ${
            activeTab === "wall"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("wall")}
    >
        📰 Wall
    </button>

    <button
        className={`tab ${
            activeTab === "reading"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("reading")}
    >
        📖 Reading
    </button>

    <button
        className={`tab ${
            activeTab === "wishlist"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("wishlist")}
    >
        ⭐ Wishlist
    </button>

    <button
        className={`tab ${
            activeTab === "library"
                ? "tab-active"
                : ""
        }`}
        onClick={() => setActiveTab("library")}
    >
        📚 Library
    </button>

</div>

            {canViewPrivateProfile ? (

                <>
                {activeTab === "wall" && (
                    <div className="mt-10">

                <h2 className="text-3xl font-bold mb-6">
                    Posts ({posts.length})
                </h2>

                <div className="space-y-6">

                    {posts.length === 0 ? (

                        <div className="text-center text-gray-500">
                            This user hasn't shared any posts yet.
                        </div>

                    ) : (

                        posts.map((post) => (
                        <PostCard
                        key={post._id}
                        post={post}
                        />
                    ))

                    )}

                </div>

            </div>
                )}
                 {activeTab === "reading" && (

<div className="text-center py-20">

<h2 className="text-3xl font-bold">
📖 Reading
</h2>

<p className="opacity-60 mt-3">

No books yet.

</p>

</div>

)}

    {activeTab === "library" && (

<div className="text-center py-20">

<h2 className="text-3xl font-bold">
📚 Library
</h2>

<p className="opacity-60 mt-3">

No books yet.

</p>

</div>

)}

    {activeTab === "wishlist" && (

<div className="text-center py-20">

<h2 className="text-3xl font-bold">
⭐ Wishlist
</h2>

<p className="opacity-60 mt-3">

No books yet.

</p>

</div>

)}
  </>

                ) : (

                    <div className="mt-12 text-center">

                        <h2 className="text-2xl font-bold">
                            🔒 Private Account
                        </h2>

                        <p className="opacity-60 mt-2">
                            Follow this user to see their posts.
                        </p>
                    </div>
                )}

          </div>

        </div>
    );
};

export default ProfilePage;