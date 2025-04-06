import { useEffect, useState, useContext } from "react";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel, InputAdornment, IconButton } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "", isAdmin: false });
    const [resetData, setResetData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Fetch users on load
    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/users", {
            headers: { Authorization: `Bearer ${user.token}` }
        })
            .then(res => setUsers(res.data))
            .catch(err => {
                console.error("Error fetching users:", err);
                setUsers([]); // Ensure it's always an array
            });
    }, []);

    // Handle adding new user
    const handleAddUser = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/add-user", newUser, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert("User added successfully!");
            setNewUser({ name: "", email: "", password: "", role: "", isAdmin: false }); // Clear form
            window.location.reload(); // Refresh users list
        } catch (error) {
            alert(error.response?.data?.msg || "Error adding user");
        }
    };

    // Handle resetting password
    const handleResetPassword = async () => {
        try {
            await axios.put("http://localhost:5000/api/auth/reset-password", resetData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert("Password reset successfully!");
            setResetData({ email: "", password: "" }); // Clear form
        } catch (error) {
            alert(error.response?.data?.msg || "Error resetting password");
        }
    };


    return (
        <Container>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
            {/* Users Table */}
            <Typography variant="h6">User List</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users && users.length > 0 ? (
                        users.map(user => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3}>Loading users...</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Add New User Form */}
            <Typography variant="h6" sx={{ mt: 3 }}>Add New User</Typography>
            <TextField
                label="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                fullWidth required margin="normal"
            />
            <TextField
                label="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                fullWidth required margin="normal"
            />
            <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                fullWidth required margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <FormControl fullWidth required margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                    label="Role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <MenuItem value="eanager">Manager</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                </Select>
            </FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={newUser.isAdmin}
                        onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
                    />
                }
                label="Is Admin?"
            />
            <Button onClick={handleAddUser} variant="contained" color="primary" sx={{ mt: 2 }}>Add User</Button>

            {/* Reset Password Form */}
            <Typography variant="h6" sx={{ mt: 3 }}>Reset User Password</Typography>
            <TextField
                label="User Email"
                value={resetData.email}
                onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                fullWidth required margin="normal"
            />
            <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={resetData.password}
                onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                fullWidth required margin="normal"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button onClick={handleResetPassword} variant="contained" color="secondary" sx={{ mt: 2 }}>Reset Password</Button>
        </Container>
    );
};

export default AdminPanel;
