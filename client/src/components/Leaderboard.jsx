import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { Container, Typography } from "@mui/material";

const Leaderboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/leaderboard", {
            headers: { Authorization: `Bearer ${user.token}` }
        })
        .then(response => setData(response.data))
        .catch(err => console.error("Error fetching leaderboard:", err));
    }, [user]);

    return (
        <Container>
            <Typography variant="h4">Leaderboard</Typography>
            {data.map((entry, index) => (
                <Typography key={index}>
                    {index + 1}. {entry.name} - {entry.completedTasks} tasks completed (Avg Time: {entry.avgCompletionTime} days)
                </Typography>
            ))}
        </Container>
    );
};

export default Leaderboard;
