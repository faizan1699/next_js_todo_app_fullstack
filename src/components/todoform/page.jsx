"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, useMediaQuery } from '@mui/material';

const TodoForm = () => {
    const matches = useMediaQuery('(min-width:650px)');
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [todos, setTodos] = useState({ todo: "", description: "" }); // Changed from title to todo

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodos(prevInput => ({ ...prevInput, [name]: value }));
    };

    const handleTodoForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);

        try {
            
            const response = await axios.post("/api/usersdata/todos", todos);
            setMsg(response.data.message);
            setLoading(false);
            setTimeout(() => setMsg(null), 8000);

        } catch (error) {
            setMsg(error.response.data.message);
            console.log(error);
            setLoading(false);
            setTimeout(() => setMsg(null), 8000);
        }
    };

    return (
        <Box component="div" sx={{ maxWidth: matches ? "65%" : "95%", mx: "auto" }}>
            <Typography component="h5" variant="h5" className='text-center font-extrabold'>Todo App</Typography>
            <Typography component="h6" variant="h5" className='text-center font-extrabold my-2'>{msg && msg}</Typography>
            <form onSubmit={handleTodoForm} method="post">
                <TextField
                    name="todo" // Changed from title to todo
                    label="Todo"
                    size="small"
                    type='text'
                    onChange={handleInputChange}
                    value={todos.todo} // Changed from title to todo
                    fullWidth
                    sx={{ mb: 1 }}
                    autoComplete='off'
                />
                <TextField
                    name="description"
                    label="Description"
                    size="small"
                    type='text'
                    onChange={handleInputChange}
                    value={todos.description}
                    sx={{ mb: 1 }}
                    multiline
                    rows={4}
                    fullWidth
                    autoComplete='off'
                />
                <Button type="submit" fullWidth variant='contained' sx={{ backgroundColor: "#000" }}>
                    {loading ? "Loading..." : "Save Todo"}
                </Button>
            </form>
        </Box>
    );
};

export default TodoForm;
