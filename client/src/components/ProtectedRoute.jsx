import React, { useContext,useState,useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user !== null) {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading) return "Loading...";

    if (!user || (requiredRoles.length && !requiredRoles.includes(user.role))) {
        return <Navigate to="/" replace />;
    }

    return children;
};


export default ProtectedRoute;
