import React, { useContext, useState, useEffect } from "react";
import {
    Box, Container, Typography, Button, TextField, Select, MenuItem,
    FormControl, InputLabel, Autocomplete, Card, CardContent, CardActions
} from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Analytics from "./PerformanceAnalytics";
import Leaderboard from "./Leaderboard";

const ManagerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("dashboard");
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
    });
    const [filters, setFilters] = useState({ status: "", assignedTo: "", dueDate: "" });

    useEffect(() => {
        if (!user?.token) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Tasks
                const taskRes = await axios.get("http://localhost:5000/api/task/manager-tasks", {
                    headers: { Authorization: `Bearer ${user.token}` },
                    params: filters,
                });

                // Fetch Employees
                const employeeRes = await axios.get("http://localhost:5000/api/auth/users", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                // Filter employees with role 'employee'
                const employeesList = employeeRes.data.filter(emp => emp.role === "employee");

                setTasks(taskRes.data);
                setEmployees(employeesList);
            } catch (err) {
                console.error("Error fetching data:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, filters]);

    const handleAssignTask = async () => {
        if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.dueDate) {
            alert("Please fill all fields before assigning a task.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/task/assign", newTask, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            const assignedEmployee = employees.find(emp => emp._id === newTask.assignedTo);

            // Append task with assigned employee details
            const updatedTask = { ...res.data, assignedTo: assignedEmployee };

            setTasks([...tasks, updatedTask]); // Update state with the new task
            setNewTask({ title: "", description: "", assignedTo: "", dueDate: "" }); // Reset form
        } catch (err) {
            console.error("Error assigning task:", err.response?.data || err.message);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://localhost:5000/api/task/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err.response?.data || err.message);
        }
    };

    return (
        <Box sx={{ display: "flex" }}>
            <Container sx={{ padding: "10px" }}>
                {view === "dashboard" && (
                    <>
                        <Typography variant="h4">Welcome, {user?.name}!</Typography>
                        <Typography variant="h6">Role: {user?.role}</Typography>

                        {/* Task Filters */}
                        <Typography variant="h6">Filter Tasks</Typography>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Employee</InputLabel>
                            <Select value={filters.assignedTo} onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}>
                                <MenuItem value="">All</MenuItem>
                                {employees.map(emp => (
                                    <MenuItem key={emp._id} value={emp._id}>
                                        {emp.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Due Date"
                            type="date"
                            value={filters.dueDate}
                            onChange={(e) => setFilters({ ...filters, dueDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />

                        {/* Assign Task Form */}
                        <Typography variant="h6" gutterBottom>Assign Task</Typography>
                        <TextField label="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} fullWidth margin="normal" />
                        <TextField label="Task Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} fullWidth margin="normal" />

                        <Autocomplete
                            options={employees}
                            getOptionLabel={(emp) => emp.name}
                            value={employees.find(emp => emp._id === newTask.assignedTo) || null}
                            onChange={(event, newValue) => setNewTask({ ...newTask, assignedTo: newValue?._id || "" })}
                            renderInput={(params) => <TextField {...params} label="Assign To" fullWidth />}
                        />

                        <TextField
                            label="Due Date"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />

                        <Button onClick={handleAssignTask} variant="contained" color="primary">Assign Task</Button>

                        {/* Task List */}
                        <Typography variant="h6" gutterBottom>Assigned Tasks</Typography>
                        {loading ? (
                            <Typography>Loading tasks...</Typography>
                        ) : tasks.length === 0 ? (
                            <Typography>No tasks assigned yet</Typography>
                        ) : (
                            tasks.map((task) => (
                                <Card key={task._id} sx={{ marginTop: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">{task.title} - {task.status}</Typography>
                                        <Typography variant="body2">Assigned to: {task.assignedTo?.name || "Unknown"}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleDeleteTask(task._id)} variant="contained" color="error">Delete</Button>
                                    </CardActions>
                                </Card>
                            ))
                        )}
                    </>
                )}
                {view === "analytics" && <Analytics />}
                {view === "leaderboard" && <Leaderboard />}
            </Container>
        </Box>
    );
};

export default ManagerDashboard;
