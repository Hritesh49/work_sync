import React, { useContext,useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    // console.log("User",user)
    useEffect(() => {
        if (user !== null) {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) return "Loading..."; // Prevents flashing of redirect message

    // Check if user is logged in and if the role matches
    if (!user || (requiredRole && user.role !== requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
