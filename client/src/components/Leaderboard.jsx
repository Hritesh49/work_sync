import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { Container, Typography, Table, TableBody, TableCell, TableRow, TableHead } from "@mui/material";

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
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Task Completed</TableCell>
                        <TableCell>Average Completion Time</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}.</TableCell>
                                <TableCell>{entry.name}</TableCell>
                                <TableCell>{entry.completedTasks}</TableCell>
                                <TableCell>{entry.avgCompletionTime} days</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </Container>
    );
};

export default Leaderboard;


