import React, { useState, useContext } from 'react';
import { TextField, Button, IconButton, InputAdornment, Container, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Email and password are required');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Invalid email format');
            return;
        }

        try {
            // console.log("🔄 Sending login request with:", { email, password });

            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            // console.log("✅ Login successful:", res.data);

            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));  // ✅ Store full user data

            // console.log("📦 Stored user in localStorage:", JSON.parse(localStorage.getItem("user")));
            if (res.data.isAdmin && res.data.role) {
                navigate(`/${res.data.role.toLowerCase()}-dashboard`);  // Default to admin panel
            } else if (res.data.role === "employee") {
                navigate("/employee-dashboard");
            } else if (res.data.role === "manager") {
                navigate("/manager-dashboard");
            }
        } catch (err) {
            // console.error("❌ Login failed:", err.response?.data || err.message);
            alert('Login failed. Please try again.');
        }
    };


    return (
        <Container>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;
