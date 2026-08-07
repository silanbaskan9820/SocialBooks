import { useEffect, useState } from "react";
import { Search, Ban, CheckCircle } from "lucide-react";
import {
    getAllUsers,
    banUser,
} from "../../services/adminService";
import { useNavigate } from "react-router-dom"

const UsersPage = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("");
    const [status, setStatus] = useState("");
    const [privacy, setPrivacy] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout (async () => {
            
            try {

                setLoading(true);

                const data = await getAllUsers({
                    search,
                    role,
                    status,
                    privacy,
                });

                setUsers(data.users);
            
            } catch (error) {
                
                console.error("Users error:", error);
            
            } finally {
                
                setLoading(false);
            
            }
        }, 500);
        
        return () => clearTimeout(timer);
    
    }, [search, role, status, privacy]);

    const handleBan = async (id) => {

        try {

            const data = await banUser(id);

            console.log(data);

            setUsers((prevUsers) => 
                prevUsers.map((user) =>
                     user._id === id
                            ? {
                                ...user,
                                isBanned: !user.isBanned,
                            }
                            : user
                        )
                    )

        } catch (error) {

            console.error("Ban error:", error);

        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    User Management
                </h1>

                <p className="text-base-content/60 mt-1">
                    Manage SocialBooks users
                </p>

            </div>

            <div className="p-4 border-b">

                <div className="space-y-4">

                    <div className="relative max-w-md">
                    <Search
                        size={18} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
                        />

                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                    />
                </div>

                <div className="flex gap-3">
                         <select
                    className="select select-bordered"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >

                    <option value="">
                        All Roles
                    </option>

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

                <select
                    className="select select-bordered"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="banned">
                        Banned
                    </option>
                </select>

                <select
                    className="select select-bordered flex-1"
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                >

                    <option value="">
                        All Privacy
                    </option>

                    <option value="public">
                        Public
                    </option>

                    <option value="private">
                        Private
                    </option>
                </select>
                </div>
                
            </div>
        </div>
            <div className="card bg-base-100 shadow-md">

                <div className="card-body p-0">

                    <div className="overflow-x-auto">

                        <table className="table">

                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Privacy</th>
                                    <th>Followers</th>
                                    <th>Following</th>
                                    <th>Posts</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user._id}>

                                        <td>
                                            
                                            <div
                                                className="flex items-center gap-3 cursor-pointer group"
                                                onClick={() => navigate(`/admin/users/${user._id}`)}
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
                                                    
                                                    <div className="font-bold group-hover:text-primary transition">
                                                        {user.username}
                                                    </div>
                                                    
                                                    <div className="text-sm opacity-60">
                                                        {user.name} {user.surname}
                                                    </div>
                                                    
                                                </div>
                                                
                                            </div>
                                            
                                        </td>

                                        <td>
                                            <span className="badge badge-outline">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>

                                            {user.isBanned ? (

                                                <span className="badge badge-error">
                                                    Banned
                                                </span>

                                            ) : (

                                                <span className="badge badge-success">
                                                    Active
                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {user.privacy?.privateAccount ? (
                                                <span className="badge badge-warning">
                                                    Private
                                                </span>
                                            ) : (
                                                <span className="badge badge-info">
                                                    Public
                                                </span>
                                            )}

                                        </td>

                                        <td>
                                            {user.followersCount}
                                        </td>

                                        <td>
                                            {user.followingCount}
                                        </td>

                                        <td>
                                            {user.postsCount}
                                        </td>

                                        <td>

                                            <button
                                                className={`btn btn-sm ${
                                                    user.isBanned
                                                        ? "btn-success"
                                                        : "btn-error"
                                                }`}
                                                onClick={() =>
                                                    handleBan(user._id)
                                                }
                                            >

                                                {user.isBanned ? (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Unban
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban size={16} />
                                                        Ban
                                                    </>
                                                )}

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default UsersPage;