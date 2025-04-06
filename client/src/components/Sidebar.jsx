import React, { useContext } from "react";
import { Drawer, List, ListItemButton, ListItemText, Divider, Box, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";

const NAVIGATION = [
    { kind: "header", title: "Main Items" },
    { segment: "/manager-dashboard", title: "Dashboard", icon: <DashboardIcon /> },
    { kind: "divider" },
    { kind: "header", title: "Analytics" },
    {
        segment: "/manager-dashboard/analytics",
        title: "Performance Analytics",
        icon: <BarChartIcon />,
        managerOnly: true, // Only for managers
    },
    {
        segment: "/manager-dashboard/leaderboard",
        title: "Leaderboard",
        icon: <DescriptionIcon />,
        managerOnly: true, // Only for managers
    }
];

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <Box>
            <Button onClick={toggleDrawer(true)}>Open drawer</Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <List>
                    {NAVIGATION.map((item, index) => {
                        if (item.kind === "divider") return <Divider key={index} />;
                        if (item.kind === "header")
                            return <ListItemText key={index} primary={item.title} sx={{ pl: 2, pt: 1, fontWeight: "bold" }} />;
                        if (item.managerOnly && user?.role !== "manager") return null; // Hide manager-only items

                        return (
                            <ListItemButton
                                key={index}
                                component={Link}
                                to={item.segment}
                                selected={location.pathname === item.segment}
                            >
                                {item.icon && <span style={{ marginRight: 10 }}>{item.icon}</span>}
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        );
                    })}
                </List>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
