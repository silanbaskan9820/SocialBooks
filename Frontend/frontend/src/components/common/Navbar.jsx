import { Link, useNavigate } from "react-router-dom";
import { PlusIcon, Bell, Search } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getNotifications, markNotificationAsRead } from "../../services/notificationService";
import { searchUsers, searchPosts } from "../../services/searchService";
import { User, UserPen, Settings, LogOut } from "lucide-react"; 

const Navbar = () => {

  const { user, logout } = useContext(AuthContext);

  const [query, setQuery] = useState("");
  
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
});

const [loading, setLoading] = useState(false);

const [showDropdown, setShowDropdown] = useState(false);

const [notifications, setNotifications] = useState([]);
const unreadCount = notifications.filter(
  notification => !notification.isRead).length;

const [showNotifications, setShowNotifications] = useState(false);

const [history, setHistory] = useState([]);

const navigate = useNavigate();

const handleLogout = () => {
    logout();
    navigate("/login");
  };

useEffect(() => {
   if (!user) return;

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

    fetchNotifications();

}, [user]);

const highlightText = (text, keyword) => {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
  part.toLowerCase() === keyword.toLowerCase() ? (
    <span
        key={index}
        className="bg-yellow-300 text-blue-800 px-0.5 rounded"
    >
      {part}
    </span>
  ) : (
    part
  )
);
};

const handleNotificationClick = async (notificationId) => {
    try {
        await markNotificationAsRead(notificationId);

        setNotifications(prev =>
            prev.map(notification =>
                notification._id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );

        setShowNotifications(false);

    } catch (error) {
        console.error(error);
    }
};

useEffect(() => {

    const timer = setTimeout(async () => {

        if (!query.trim()) {
            setSearchResults({
                users: [],
                posts: [],
            });

            setShowDropdown(false);
            return;
        }

        try {

            setLoading(true);

            const [users, posts] = await Promise.all([
              searchUsers(query),
              searchPosts(query),
            ]);
            
            setSearchResults({
              users,
              posts,
            });

            setShowDropdown(true);
            console.log("Dropdown opened");

          } catch (error) {
            console.error(error);

          } finally {

            setLoading(false);

          }

        }, 300);
        
        return () => clearTimeout(timer);
      
      }, [query]);

      const saveSearch = (value) => {
        const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

        const updated = [
          value, 
          ...history.filter(item => item !== value),
        ].slice(0, 5);

        localStorage.setItem(
          "searchHistory",
          JSON.stringify(updated)
        );
        setHistory(updated);
      };

      const loadHistory = () => {
        const data = JSON.parse(localStorage.getItem("searchHistory")) || [];
        setHistory(data);
      };
      
      const clearHistory = () => {
    localStorage.removeItem("searchHistory");
    setHistory([]);
    setQuery("");
};

      return (
      
      <header className="sticky top-0 z-50 bg-base-300/90 backdrop-blur-md border-b border-base-content/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3">
          
          <Link to="/" className="text-4xl font-bold font-mono text-primary hover:scale-105 transition">
          SocialBooks
          </Link>
          
          <div className="relative w-72">
            <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
    onClick={() => {
        if (!query.trim()) {
            loadHistory();
            setShowDropdown(true);
            return;
        } 
        saveSearch(query);
        navigate(`/search?q=${query}`);
        setQuery("");
        setShowDropdown(false);
            
        }
    }
/>
            
            <input
            type="text"
            placeholder="Search users or posts..."
            className="input input-bordered w-full pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (!query.trim()) {
                loadHistory();
              }
              
              setShowDropdown(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setShowDropdown(false);
              }, 150);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                saveSearch(query);
                navigate(`/search?q=${query}`);
                setQuery("");
                setShowDropdown(false);
              }
            }}
          />
          
{showDropdown && (
  <div className="absolute top-full left-0 mt-2 w-full bg-base-100 rounded-xl shadow-xl border z-50 overflow-hidden">

    {!query.trim() ? (
      history.length > 0 ? (
        <>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm font-semibold">
              Recent Searches
            </span>

            <button
            type="button"
              className="text-xs text-primary"
              onClick={(e) => {
                e.stopPropagation();
                clearHistory();
              }}
            >
              Clear
            </button>
          </div>

          {history.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-base-200 cursor-pointer transition"
              onClick={() => {
                setQuery(item);
                navigate(`/search?q=${item}`);
                setQuery("");
                setShowDropdown(false);
              }}
            >
              🕘 {item}
            </div>
          ))}
        </>
      ) : (
        <div className="p-4 text-center text-sm opacity-60">
          No recent searches.
        </div>
      )
    ) : (
      <>
      
        {loading && (
          <div className="p-4 text-center">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}

        {!loading &&
          searchResults.users.length === 0 &&
          searchResults.posts.length === 0 && (
            <div className="p-4 text-center text-sm opacity-60">
              No results found.
            </div>
          )}

        {!loading && searchResults.users.length > 0 && (
          <>
            <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase opacity-60">
              Users
            </div>

            {searchResults.users.slice(0, 4).map((result) => (
              <Link
                key={result._id}
                to={`/profile/${result._id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-base-200"
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                }}
              >
                <img
                  src={
                    result.profileImage
                      ? `http://localhost:5002${result.profileImage}`
                      : "/avatar.png"
                  }
                  alt={result.username}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/avatar.png";
                  }}
                />

                <div>
                  <p className="font-semibold">
                    {highlightText(
                      `${result.name} ${result.surname}`,
                      query
                    )}
                  </p>

                  <p className="text-xs opacity-60">
                    @{highlightText(result.username, query)}
                  </p>
                </div>
              </Link>
            ))}
          </>
        )}

        {!loading && searchResults.posts.length > 0 && (
          <>
            <div className="border-t"></div>

            <div className="px-4 pt-3 pb-2 text-xs font-semibold uppercase opacity-60">
              Posts
            </div>

            {searchResults.posts.slice(0, 4).map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className="block px-4 py-3 hover:bg-base-200"
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                }}
              >
                <p className="font-semibold line-clamp-1">
                  {highlightText(post.title, query)}
                </p>

                <p className="text-xs opacity-60">
                  @{post.author?.username}
                </p>
              </Link>
            ))}
          </>
        )}

        {/* SEE ALL */}
        {!loading &&
          (searchResults.users.length > 0 ||
            searchResults.posts.length > 0) && (
            <>
              <div className="border-t"></div>

              <button
                className="w-full py-3 text-primary font-semibold hover:bg-base-200 transition"
                onClick={() => {
                  saveSearch(query);
                  navigate(`/search?q=${query}`);
                  setQuery("");
                  setShowDropdown(false);
                }}
              >
                See all results →
              </button>
            </>
          )}
      </>
    )}
  </div>
)}
</div>

{user && (
  <div className="relative">

    <button
    className="btn btn-ghost btn-circle"
    onClick={() => setShowNotifications(prev => !prev)}
    >
 <div className="indicator">

  {unreadCount > 0 && (
    <span className="indicator-item badge badge-error badge-sm">
      {unreadCount}
    </span>
  )}

  <Bell size={22} />

 </div>
    </button>

        {showNotifications && (
  <div className="absolute right-0 top-12 w-80 bg-base-100 rounded-xl shadow-xl border z-50">

    {notifications.length === 0 ? (

      <div className="p-4 text-center text-sm opacity-60">
        No notifications yet.
      </div>

    ) : (

      notifications.map((notification) => (

        <Link
          key={notification._id}
          to={
            notification.type === "follow"
            ? `/profile/${notification.sender._id}`
            : `/posts/${notification.post?._id}`
          }
          /*to={`/profile/${user._id}`}*/ /*kendi profiline gitmek için*/
            onClick={() => {
            handleNotificationClick(notification._id);
          }}
          className={`flex gap-3 p-3 border-b hover:bg-base-200 ${
            notification.isRead ? "" : "bg-primary/10"
          }`}
        >
          <img
            src={
              notification.sender.profileImage
                ? `http://localhost:5002${notification.sender.profileImage}`
                : "/avatar.png"
            }
            alt={notification.sender.username}
            className="w-10 h-10 rounded-full object-cover"
          />

          <div>
            <p>
              <span className="font-semibold">
                {notification.sender.username}
              </span>{" "}
              
              {notification.type === "follow" && "started following you."}
              
              {notification.type === "like" && "liked your post."}
              
              {notification.type === "comment" && "commented on your post."}
               
            </p>

            <p className="text-xs opacity-60">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </Link>

      ))
    )}

  </div>
)}
    </div>    
)}

        {user && (
    <Link
        to="/posts/create"
        className="btn btn-primary rounded-xl gap-2 shadow-md"
    >
        <PlusIcon size={18}/>
        New Post
    </Link>
)}

        {user && (
  <div className="dropdown dropdown-end">

    <div 
    tabIndex={0} 
    role="button" 
    className="btn btn-ghost rounded-full flex items-center gap-3 px-2">

      <img
        src={
        user.profileImage
          ? `http://localhost:5002${user.profileImage}`
          : "/avatar.png"
      }
        alt={user.username}
        className="w-10 h-10 rounded-full object-cover border border-base-300"
        onError={(e) => {
          e.target.src = "/avatar.png";
        }}
      />

      <div className="hidden md:flex flex-col items-start leading-none">
      <p className="font-semibold">
    {highlightText(user.username, query)}
</p>

<p className="text-xs opacity-70">
    {highlightText(`${user.name} ${user.surname}`, query)}
</p>
    </div>
    </div>

    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-50 w-56 p-2 shadow-xl border"
    >

      <li>
        <Link to={`/profile/${user._id}`}
        className="flex items-center gap-2">
          <User size={18} />
          My Profile
        </Link>
      </li>

      <li>
        <Link to={`/profile/${user._id}`}
        className="flex items-center gap-2">
          <UserPen size={18}/>
          Edit Profile
        </Link>
      </li>

      <li>
        <Link to="/settings" 
        className="flex items-center gap-2">
          <Settings size={18}/>
          Settings
        </Link>
      </li>

      <div className="divider my-1"></div>

      <li>
        <button 
        onClick={handleLogout}
        className="flex items-center gap-2">
          <LogOut size={18} />
          Logout
        </button>
      </li>

    </ul>

  </div>
)}
          {!user && (
  <div className="flex items-center gap-2">
    <Link to="/login" className="btn btn-primary">
      Login
    </Link>

    <Link to="/register" className="btn btn-outline btn-primary">
      Register
    </Link>
  </div>
)}

      </div>
    </header>
  );
};

export default Navbar;