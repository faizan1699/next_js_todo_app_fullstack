"use client"

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

const Login = () => {

    const router = useRouter();
    const matches = useMediaQuery('(min-width:650px)');

    const [msg, setMsg] = useState(null);
    const [passtype, setPassType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prevInput => ({
            ...prevInput,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg(null);
        try {
            const response = await axios.post("/api/users/auth/login", inputs);
            setMsg(response.data.message);
            setLoading(false);
            if (response.data.success) {
                router.push('/home');
            } else {
                router.push('/login');
            }
            setTimeout(() => {
                setMsg(null);
            }, 8000);
        } catch (error) {
            console.error(error);
            setMsg(error.response.data.message || "Login failed");
            setLoading(false);
            setTimeout(() => {
                setMsg(null);
            }, 8000);
        }
    };

    const showPassword = () => {
        setPassType(passtype === "password" ? "text" : "password");
    };

    const forgetPassword = async () => {
        const email = prompt("Please enter your email:");

        if (email === null) {
            alert("Email input was canceled");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation
        if (!emailRegex.test(email)) {
            alert("Invalid Email. Please check your email format.");
            return;
        }

        try {
            const response = await axios.post('/api/users/resetpassword', { email });
            console.log(response.data.message);
            setMsg(response.data.message)
        } catch (error) {
            console.error(error);
            alert("Failed to reset password. Please try again later.");
        }
    };

    return (
        <Box className='m-5'>
            <Box component="div" sx={{ maxWidth: matches ? "45%" : "95%", mx: "auto" }}>
                <Typography variant="h3" className='text-center mb-2 text-black-200 font-extrabold'>Login</Typography>
                <Typography variant="body1" className='text-center text-red-600 mb-2 text-black-200 font-extrabold'>{msg}</Typography>
                <form onSubmit={handleLogin} method="post">
                    <TextField
                        name="email"
                        label="Email"
                        size="small"
                        type='email'
                        onChange={handleInputChange}
                        value={inputs.email}
                        fullWidth
                        sx={{ mb: 1 }}
                        autoComplete='off'
                    />
                    <TextField
                        name="password"
                        label="Password"
                        size="small"
                        type={passtype}
                        onChange={handleInputChange}
                        value={inputs.password}
                        fullWidth
                        sx={{ mb: 1 }}
                    />

                    <Box component="div" className='justify-end flex g-5'>
                        <Button className='text-xs bg-red-500 text-white hover:bg-red-500 hover:text-white mb-1 me-2' type="button" onClick={forgetPassword}>Forget Password</Button>
                        <Button className='text-xs bg-red-500 text-white hover:bg-red-500 hover:text-white mb-1' type="button" onClick={showPassword}>
                            {passtype === "password" ? "Show Password" : "Hide Password"}
                        </Button>
                    </Box>

                    <Button type="submit" fullWidth variant='contained' sx={{ backgroundColor: "#000" }}>
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </form>

                <Box component="div" className='mt-2 text-end hover:text-red-500'>
                    <Link href="/register" className='text-blue-500 text-end'>Don't have an account? Signup</Link>
                </Box>

            </Box>
        </Box>
    );
}

export default Login;
