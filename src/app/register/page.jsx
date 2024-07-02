"use client";

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Register = () => {

    const matches = useMediaQuery('(min-width:650px)');
    const router = useRouter();

    const [msg, setMsg] = useState(null);
    const [emailNotification, setEmailNotification] = useState(null);
    const [loading, setLoading] = useState(false);
    const [passtype, setPassType] = useState("password");
    const [inputs, setInputs] = useState({
        username: "",
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

    const handleRegister = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (loading) {
            setMsg(null);
            setEmailNotification(null);
        }

        const { username, email, password } = inputs;

        if (!username) {
            setMsg("Username Required");
            setLoading(false);
        }
        else if (!email) {
            setMsg("Email Required");
            setLoading(false);
        }
        else if (!password) {
            setMsg("Password Required");
            setLoading(false);
        }
        else if (password.length < 8) {
            setMsg("Password must be 8 characters");
            setLoading(false);
        }
        else {
            try {

                const response = await axios.post("/api/users/auth/signup", inputs);

                const message = response.data.message;

                setMsg(message);
                console.log(message);

                if (response.status === 200) {

                    if (message === "User already exists") { }
                    else {
                        setEmailNotification(true);
                    }
                    setLoading(false);
                    setTimeout(() => {
                       router.push('/login');
                    }, 4000);
                } else {
                    setLoading(false);
                }

            } catch (error) {
                setMsg(error.response.data.error);
                setLoading(false);
            }

            setTimeout(() => {
                setMsg(null);
                setEmailNotification(null);
            }, 20000);

        }

    };

    const showPassword = () => {
        setPassType(passtype === "password" ? "text" : "password");
    };

    return (
        <Box className='m-5'>
            <Box component="div" sx={{ maxWidth: matches ? "45%" : "95%", mx: "auto" }}>

                <Typography component="h1" variant="h3" className='text-center mb-2 text-black-200 font-extrabold'>Register</Typography>

                <Typography component="p" variant="p" className='text-center text-red-600 mb-2 text-black-200 font-extrabold'>{msg && msg} </Typography>

                {emailNotification === false && (
                    <Typography component="p" variant="p" className='text-center text-red-600 mb-2'>
                        Failed to send verification email. Please check your email address.
                    </Typography>
                )}
                {emailNotification === true && (
                    <Typography component="p" variant="p" className='text-center text-green-600 mb-2'>
                        Verification email sent. Please check your inbox.
                    </Typography>
                )}

                <form onSubmit={handleRegister} method="POST" autoComplete="off">
                    <TextField
                        name="username"
                        label="Username"
                        size="small"
                        type='text'
                        onChange={handleInputChange}
                        value={inputs.username}
                        fullWidth
                        sx={{ mb: 1 }}
                        autoComplete="new-username"
                    />
                    <TextField
                        name="email"
                        label="Email"
                        size="small"
                        type='email'
                        onChange={handleInputChange}
                        value={inputs.email}
                        fullWidth
                        sx={{ mb: 1 }}
                        autoComplete="new-email"
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
                        autoComplete="new-password"
                    />
                    <Box component="div" className='justify-end flex '>
                        <Button className='text-xs  hover:bg-red-400 hover:text-white mb-1' type="button" onClick={showPassword}>
                            {passtype === "password" ? "Show Password" : "Hide Password"}
                        </Button>
                    </Box>

                    <Button type="submit" className='hover:bg-blue-800' variant='contained' fullWidth sx={{ backgroundColor: "#000" }}>
                        {loading ? "Loading ..." : "Register"}
                    </Button>

                </form>

                <Box component="div" className='mt-2 text-end hover:text-red-500'>
                    <Link href="/login" className='text-blue-500 text-end '>Already have an account? Login</Link>
                </Box>

            </Box>

        </Box>
    );
};

export default Register;
