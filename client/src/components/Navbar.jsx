import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminView = location.pathname === "/admin"; // Dynamically derive it

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleSwitchView = () => {
        if (!user) return;

        const newPath = isAdminView
            ? `/${user.role.toLowerCase()}-dashboard`
            : (user.isAdmin ? "/admin" : `/${user.role.toLowerCase()}-dashboard`);

        navigate(newPath);
    };


    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
                    NeoHRMS
                </Typography>

                {user && (
                    <Box>
                        {user.isAdmin && (
                            <Button color="inherit" onClick={handleSwitchView}>
                                {isAdminView ? "Switch to Role View" : "Switch to Admin Panel"}
                            </Button>
                        )}
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
