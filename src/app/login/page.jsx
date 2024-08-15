"use client"

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, TextField, Typography, useMediaQuery } from '@mui/material';

const Login = () => {

    const router = useRouter();
    const matches = useMediaQuery('(min-width:650px)');

    const [msg, setMsg] = useState(null);
    const [passtype, setPassType] = useState("password");
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "12345678"
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
        setMsg(null);

        const { email, password } = inputs;

        if (!email) {
            setMsg("email required")
        }
        else if (!password) {
            setMsg("password required");
        }
        else {
            setLoading(true);
            try {
                const response = await axios.post("/api/users/auth/login", inputs);
                setMsg(response?.data?.message);
                setLoading(false);
                router.push('/');
                setTimeout(() => {
                    setMsg(null);
                }, 8000);
                localStorage.setItem("email", email);
            } catch (error) {
                console.error(error);
                setMsg(error.response.data.message);
                setLoading(false);
                setTimeout(() => {
                    setMsg(null);
                }, 8000);
            }
        }
    };

    const togglepasstype = () => {
        setPassType(!passtype);
    };

    const forgetPassword = () => {
        router.push('/resetpassword');
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
                        type={passtype ? 'text' : 'password'}
                        value={inputs.password}
                        onChange={handleInputChange}
                        fullWidth
                        sx={{ mb: 1 }}
                        autoComplete='current-password'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={togglepasstype}
                                        edge="end"
                                    >
                                        {passtype ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />


                    <Box component="div" className='justify-end flex g-5'>
                        <Button className='text-xs bg-red-500 text-white hover:bg-red-500 hover:text-white mb-1 me-2' type="button" onClick={forgetPassword}>Forget Password</Button>
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