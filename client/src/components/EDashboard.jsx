import React, { useContext, useState, useEffect } from "react";
import {
    Container, Typography, Select, MenuItem, FormControl,
    InputLabel, Card, CardContent, Grid, Box
} from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Analytics from "./PerformanceAnalytics";
import Leaderboard from "./Leaderboard";

const EmployeeDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [filters, setFilters] = useState({ status: "" });
    const [view, setView] = useState("dashboard");

    useEffect(() => {
        if (!user || !user.email) return;
    
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/task/employee-tasks/${user.email}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
    
                // Apply client-side filtering if the status is selected
                const filteredTasks = filters.status
                    ? res.data.filter(task => task.status === filters.status)
                    : res.data;
    
                setTasks(filteredTasks);
            } catch (err) {
                console.error("Error fetching tasks:", err);
            }
        };
    
        fetchTasks();
    }, [user, filters]);
    

    // Update Task Status Without Page Refresh
    const handleUpdateStatus = async (taskId, status) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/task/update/${taskId}`,
                { status },
                { headers: { Authorization: `Bearer ${user.token}` }}
            );

            // Update tasks state instead of full page reload
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, status: response.data.task.status } : task
                )
            );
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Welcome, {user?.name}!</Typography>
            <Typography variant="h6">Role: {user?.role}</Typography>

            {/* Task Filter */}
            <Typography variant="h6" mt={2}>Filter Tasks</Typography>
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                </Select>
            </FormControl>

            {/* Task List */}
            <Typography variant="h6" mt={3}>Your Tasks</Typography>
            {tasks.length === 0 ? (
                <Typography>No tasks assigned</Typography>
            ) : (
                <Grid container spacing={2}>
                    {tasks.map(task => (
                        <Grid item xs={12} md={6} key={task._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{task.title}</Typography>
                                    <Typography variant="body2">Status: {task.status}</Typography>
                                    <Typography variant="body2">
                                        Assigned By: {task.assignedBy?.name || "Unknown"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Due Date: {new Date(task.dueDate).toLocaleDateString()}
                                    </Typography>

                                    {/* Status Update Dropdown */}
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <InputLabel>Update Status</InputLabel>
                                        <Select
                                            value={task.status}
                                            onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                                        >
                                            <MenuItem value="Pending">Pending</MenuItem>
                                            <MenuItem value="In Progress">In Progress</MenuItem>
                                            <MenuItem value="Completed">Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default EmployeeDashboard;
