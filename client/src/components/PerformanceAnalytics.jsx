import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { Container, Typography } from "@mui/material";

const Analytics = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/analytics", {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(response => setData(response.data))
        .catch(err => console.error("Error fetching analytics:", err));
    }, [user]);

    return (
        <Container>
            <Typography variant="h4">Performance Analytics</Typography>
            {data.map((entry, index) => (
                <Typography key={index}>
                    Employee ID: {entry.employeeName} | Completed Tasks: {entry.completedTasks} | Avg Completion Time: {entry.avgCompletionTime} days
                </Typography>
            ))}
        </Container>
    );
};

export default Analytics;
