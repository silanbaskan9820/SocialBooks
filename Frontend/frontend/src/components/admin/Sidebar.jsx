import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    MessageSquare,
    Bell,
    FileText,
    LogOut
} from "lucide-react";

const Sidebar = () => {

    const menuItems = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
        },

        {
            name: "Users",
            path: "/admin/users",
            icon: Users,
        },

        {
            name: "Posts",
            path: "/admin/posts",
            icon: FileText,
        },

        {
            name: "Comments",
            path: "/admin/comments",
            icon: MessageSquare,
        },

        {
            name: "Books",
            path: "/admin/books",
            icon: BookOpen,
        },

        {
            name: "Notifications",
            path: "/admin/notifications",
            icon: Bell,
        },
    ];

    return (
        <aside className="w-72 bg-base-100 border-r border-base-300 flex flex-col">

            <div className="p-6 border-b border-base-300">
                <h1 className="text-2xl font-bold text-primary">
                    📚 SocialBooks
                </h1>

                <p className="text-sm opacity-70">
                    Admin Panel
                </p>

            </div>

            <nav className="flex-1 p-4 space-y-2">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink 
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                                    isActive
                                       ? "bg-primary text-primary-content"
                                       : "hover:bg-base-200"
                                }`
                            }
                            >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    )
                })}

            </nav>

            <div className="border-t border-base-300 p-4">

                <button className="btn btn-error w-full gap-2">

                    <LogOut size={18} />

                    Logout

                </button>

            </div>

        </aside>
    )
}

export default Sidebar;