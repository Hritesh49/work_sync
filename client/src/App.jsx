import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import { AuthProvider } from "./context/AuthContext";
import EmployeeDashboard from "./components/EDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ManagerDashboard from "./components/MDashboard";
import { Layout, ManagerLayout } from "./components/Layout";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Analytics from "./components/PerformanceAnalytics";
import Leaderboard from "./components/Leaderboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<Layout />}>
                        <Route path="/admin" element={<ProtectedRoute requiredRole="manager"><AdminPanel /></ProtectedRoute>} />
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
    );
}

export default App;
