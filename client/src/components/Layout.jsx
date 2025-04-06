import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Container, Box } from "@mui/material";
import AuthContext from "../context/AuthContext";
import Sidebar from "./Sidebar";

const Layout = () => {
    const { user } = useContext(AuthContext);

    return (
        <>
            {user && <Navbar />}  {/* Show Navbar only when user is logged in */}
            <Container sx={{ mt: user ? 4 : 0, padding:"0px !important" }}> {/* Adjust margin if navbar is hidden */}
                <Outlet />
            </Container>
        </>
    );
};



const ManagerLayout = () => {
    return (
        <Box sx={{ display: "flex",flexDirection:"column" }}>
            <Sidebar />
            <Box>
                <Outlet />
            </Box>
        </Box>
    );
};

export { Layout, ManagerLayout };
