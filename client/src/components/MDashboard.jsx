import React, { useContext, useState, useEffect } from "react";
import {
    Box, Container, Typography, Button, TextField, Select, MenuItem,
    FormControl, InputLabel, Autocomplete, Card, CardContent, CardActions,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from "@mui/material";
import { Edit, Delete } from '@mui/icons-material';
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Analytics from "./PerformanceAnalytics";
import Leaderboard from "./Leaderboard";
import API from "../api";
const statusColors = {
    completed: 'lightgreen',
    pending: 'lightyellow',
    overdue: '#ff9999'
  };

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
    const [openChangeDialog, setOpenChangeDialog] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [changeComment, setChangeComment] = useState("");


    useEffect(() => {
        if (!user?.token) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Tasks
                const taskRes = await API.get("/api/task/manager-tasks", {
                    headers: { Authorization: `Bearer ${user.token}` },
                    params: filters,
                });

                // Fetch Employees
                const employeeRes = await API.get("/api/auth/users", {
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
            const res = await API.post("/api/task/assign", newTask, {
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
            await API.delete(`/api/task/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });

            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err.response?.data || err.message);
        }
    };

    const handleSubmitChangeRequest = async () => {
        if (!changeComment) {
            alert("Please provide a change request comment.");
            return;
        }
    
        try {
            await API.patch(`/api/task/change-request/${selectedTaskId}`, {
                message: changeComment
            }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
    
            setTasks(tasks.map(task =>
                task._id === selectedTaskId
                    ? { ...task, status: "In Progress", changeRequest: { requested: true, message: changeComment } }
                    : task
            ));
    
            setOpenChangeDialog(false);
            setChangeComment("");
        } catch (err) {
            console.error("Error submitting change request:", err.response?.data || err.message);
        }
    };
    

    return (
        <Box sx={{ display: "flex" }}>
            <Container sx={{ padding: "10px" }}>
                {view === "dashboard" && (
                    <>
                        <Typography variant="h4">Welcome, {user?.name}!</Typography>
                        <Typography variant="h6">Role: {user?.role}</Typography>

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

                        {/* Task List */}
                        <Typography variant="h6" gutterBottom>Assigned Tasks</Typography>
                        {loading ? (
                            <Typography>Loading tasks...</Typography>
                        ) : tasks.length === 0 ? (
                            <Typography>No tasks assigned yet</Typography>
                        ) : (
                            tasks.map((task) => (
                                <Card key={task._id} sx={{ marginTop: 2, backgroundColor: statusColors[task.status.toLowerCase()] }}>
                                    <CardContent>
                                        <Typography variant="h6">{task.title} - {task.status}</Typography>
                                        <Typography variant="body2">Assigned to: {task.assignedTo?.name || "Unknown"}</Typography>
                                        {task.status === "Completed" || "In Progress" && (<Typography variant="body2">Chnages Requested: {task.changeRequest.message || "Unknown"}</Typography>)}
                                    </CardContent>
                                    <CardActions>
                                        <Button onClick={() => handleDeleteTask(task._id)} variant="contained" color="error">Delete</Button>
                                        {task.status === "Completed" && (
                                            <Button
                                                onClick={() => {
                                                    setSelectedTaskId(task._id);
                                                    setOpenChangeDialog(true);
                                                }}
                                                variant="contained"
                                                color="warning"
                                            >
                                                Request Change
                                            </Button>
                                        )}

                                    </CardActions>
                                </Card>
                            ))
                        )}
                    </>
                )}
                {view === "analytics" && <Analytics />}
                {view === "leaderboard" && <Leaderboard />}
                {/* Change Request Dialog */}
                <Dialog open={openChangeDialog} onClose={() => setOpenChangeDialog(false)}>
                    <DialogTitle>Request Changes</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Comment"
                            multiline
                            rows={4}
                            fullWidth
                            value={changeComment}
                            onChange={(e) => setChangeComment(e.target.value)}
                            placeholder="Describe the changes required..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenChangeDialog(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleSubmitChangeRequest}>
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default ManagerDashboard;
