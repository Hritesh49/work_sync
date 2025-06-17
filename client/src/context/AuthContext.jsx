import { createContext, useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // console.log("🔥 AuthContext Loaded!");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            console.log("✅ Loaded user from localStorage:", JSON.parse(storedUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
        } else {
            console.warn("⚠️ No user found in localStorage.");
        }
    }, []);
    

    const login = async (email, password) => {
        console.log("🚀 login() function called with:", email, password);
        try {
            const { data } = await API.post("/api/auth/login", { email, password }, {
                headers: { "Content-Type": "application/json" }
            });
            // console.log("✅ Response received from backend:", data);
            if (!data.token || !data.email) {
                // console.error("❌ Backend response missing token or email:", data);
                return;
            }
            // console.log("user email",data.email)
            const userData = { 
                email: data.email, 
                name: data.name, 
                role: data.role, 
                token: data.token, 
                isAdmin: data.isAdmin 
            };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            console.log("✅ User logged in and token set globally.");
        } catch (error) {
            console.error("❌ Login failed:", error.response?.data || error.message);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        console.log("🚪 User logged out and token removed.");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
