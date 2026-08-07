import { useEffect, useState } from "react";
import { Users, UserX, FileText, MessageCircle, BookOpen, } from "lucide-react";
import { getDashboard } from "../../services/adminService";

const DashboardPage = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const data = await getDashboard();

                setStats(data);

            } catch (error) {

                console.error("Dashboard error: ", error);

            } finally {

                setLoading(false);

            }
        };

        fetchDashboard();

    }, []);

    if (loading) {
        return (
            <div className="flex justify-center item-center min-h-[300px]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="alert alert-error">
                Dashboard data could not be loaded.
            </div>
        );
    }

    const cards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: Users,
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: Users,
        },
        {
            title: "Banned Users",
            value: stats.bannedUsers,
            icon: UserX,
        },
        {
            title: "Total Posts",
            value: stats.posts,
            icon: FileText,
        },
        {
            title: "Total Comments",
            value: stats.comments,
            icon: MessageCircle,
        },
        {
            title: "Total Books",
            value: stats.books,
            icon: BookOpen,
        },
    ]

    return (
        <div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <p className="text-base-content/60 mt-1">
                    SocialBooks platform overview
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg.grid-cols-3 gap-6">

                {cards.map((card) => {
                    const Icon = card.icon;

                    return(
                        <div
                            key={card.title}
                            className="card bg-base-100 shadow-md"
                        >
                            <div className="card-body">

                                <div className="flex items-center justify-between">

                                    <div>
                                        <p className="text-sm text-base-content/60">
                                            {card.title}
                                        </p>

                                        <h2 className="text-3xl font-bold mt-2">
                                            {card.value}
                                        </h2>

                                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                            <Icon size={28} />
                                        </div>
                                    </div>

                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );

};

export default DashboardPage;