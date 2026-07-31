import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    const value = {
        user,
        setUser,
        logout,
    };

    const { i18n } = useTranslation();

    useEffect(() => {
        if (user?.language) {
            i18n.changeLanguage(user.language);
        }
    }, [user]);

    useEffect(() => {
    console.log("AUTH USER:", user);
}, [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};



export default AuthProvider;