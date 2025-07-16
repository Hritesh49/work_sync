import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Home = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome to WorkSync
                    </Typography>
                    <Typography variant="body1">
                        WorkSync is a powerful HR management system that integrates task management, learning, performance tracking, and rewards features, inspired by Notion. 
                        Our goal is to simplify HR processes and enhance employee experience.
                    </Typography>

                    <Box mt={3}>
                        <Typography variant="h6"> Features:</Typography>
                        <ul style={{ textAlign: "left", paddingLeft: "20px" }}>
                            <li> Task & Project Management</li>
                            <li> Learning & Development Modules</li>
                            <li> Performance Tracking & Analytics</li>
                            <li> Employee Recognition & Rewards</li>
                        </ul>
                    </Box>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 3 }}
                        onClick={() => navigate("/login")}
                    >
                        Get Started
                    </Button>
                </Paper>
            </Container>
        </>
    );
};

export default Home;
