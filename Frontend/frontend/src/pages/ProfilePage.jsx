import toast from "react-hot-toast";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile, followUser, updateUser, uploadProfilePhoto, getFollowers, getFollowing } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { Camera, Check, Pencil, UserPlus, UserCheck, X } from "lucide-react";
import WallTab from "../components/profile/WallTab";
import ProfileTabs from "../components/profile/ProfileTabs";
import FollowersModal from "../components/profile/FollowersModal";
import FollowingModal from "../components/profile/FollowingModal";
import BookSearchModal from "../components/books/BookSearchModal";
import WishlistTab from "../components/profile/WishlistTab";
import ReadingTab from "../components/profile/ReadingTab";
import LibraryTab from "../components/profile/LibraryTab";

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

const [showBookModal, setShowBookModal] = useState(false);

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
                        <button className="btn btn-outline btn-sm mt-4"
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
<FollowersModal
    show={showFollowers}
    followers={followers}
    onClose={() => setShowFollowers(false)}
/>

{/* Following Modal */}
<FollowingModal
    show={showFollowing}
    following={following}
    onClose={() => setShowFollowing(false)}
/>

<div className="flex justify-end mb-6">

    <button
        className="btn btn-outline btn-sm gap-2"
        onClick={() => setShowBookModal(true)}
    >
        + Add Book
    </button>

</div>

<ProfileTabs 
 activeTab={activeTab}
 setActiveTab={setActiveTab}
 />

            {canViewPrivateProfile ? (

                <>
                {activeTab === "wall" && (
                    <WallTab 
                        posts={posts}
                        />
                )}
                 {activeTab === "reading" && (
                    <ReadingTab />
                 )}
                 
                 {activeTab === "library" && (
                    <LibraryTab />
                )}
                
                {activeTab === "wishlist" && (
                    <WishlistTab />
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

              <BookSearchModal
    show={showBookModal}
    onClose={() => setShowBookModal(false)}
/>  
          </div>

        </div>
    );
};

export default ProfilePage;