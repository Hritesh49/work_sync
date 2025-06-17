import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import EmployeeDashboard from "./components/EDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerDashboard from "./components/MDashboard";
import { Layout, ManagerLayout } from "./components/Layout";
import Home from "./components/Home";
import Analytics from "./components/PerformanceAnalytics";
import Leaderboard from "./components/Leaderboard";

function App() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const onLoad = () => setIsLoading(false);
        window.addEventListener("load", onLoad);
        if (document.readyState === "complete") {
            onLoad();
        }
        return () => window.removeEventListener("load", onLoad);
    }, []);
    return (
        <>
            {isLoading ? (
                <div style={{ width: "100%", height: "100vh", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <AuthProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route element={<Layout />}>
                                <Route path="/admin" element={<ProtectedRoute requiredRole={["manager", "employee"]}><AdminPanel /></ProtectedRoute>} />
                                <Route path="/employee-dashboard" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
                                <Route element={<ProtectedRoute requiredRole="manager"><ManagerLayout /></ProtectedRoute>}>
                                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                                    <Route path="/manager-dashboard/analytics" element={<Analytics />} />
                                    <Route path="/manager-dashboard/leaderboard" element={<Leaderboard />} />
                                </Route>
                            </Route>
                        </Routes>
                    </Router>
                </AuthProvider>
            )};
        </>
    );
}

export default App;
