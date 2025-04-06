import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isAdminView, setIsAdminView] = useState(false);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleSwitchView = () => {
        setIsAdminView(!isAdminView);
        navigate(isAdminView ? `/${user.role.toLowerCase()}-dashboard` : "/admin");
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
                    NeoHRMS
                </Typography>

                {user && (
                    <Box>
                        {/* Show toggle button only if user is an admin */}
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
