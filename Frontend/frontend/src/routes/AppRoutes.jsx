import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import SearchPage from "../pages/SearchPage";
import PostDetailPage from "../pages/PostDetailPage";
import CreatePostPage from "../pages/CreatePostPage";
import EditPostPage from "../pages/EditPostPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

import AdminLayout from "../layouts/AdminLayout";

import DashboardPage from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import PostsPage from "../pages/admin/PostsPage";
import CommentsPage from "../pages/admin/CommentsPage";
import BooksPage from "../pages/admin/BooksPage";
import NotificationsPage from "../pages/admin/NotificationsPage";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Layout Routes */}
            <Route element={<MainLayout />}>

                <Route path="/" element={<HomePage />} />

                <Route
                    path="/profile/:id"
                    element={<ProfilePage />}
                />

                <Route
                    path="/search"
                    element={<SearchPage />}
                />

                <Route
                    path="/posts/:id"
                    element={<PostDetailPage />}
                />

                <Route
                    path="/posts/create"
                    element={
                        <ProtectedRoute>
                            <CreatePostPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/posts/edit/:id"
                    element={
                        <ProtectedRoute>
                            <EditPostPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                />

            </Route>

            <Route
            path="/admin"
            element={
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        }
    >
    <Route
        index
        element={<DashboardPage />}
    />

    <Route
        path="users"
        element={<UsersPage />}
    />

    <Route
        path="posts"
        element={<PostsPage />}
    />

    <Route
        path="comments"
        element={<CommentsPage />}
    />

    <Route
        path="books"
        element={<BooksPage />}
    />

    <Route
        path="notifications"
        element={<NotificationsPage />}
    />
</Route>

            {/* 404 */}
            <Route
                path="*"
                element={<NotFoundPage />}
            />

        </Routes>
    );
};

export default AppRoutes;