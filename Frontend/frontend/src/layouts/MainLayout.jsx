import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const MainLayout = () => {
    return (
        <>
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-6">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;