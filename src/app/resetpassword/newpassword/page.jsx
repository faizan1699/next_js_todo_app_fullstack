"use client";

import { useState } from 'react';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, TextField, Typography, useMediaQuery } from '@mui/material'

const AddNewPassword = () => {

    const router = useRouter();
    const matches = useMediaQuery('(min-width:650px)');

    const email = localStorage.email;

    const [msg, setMsg] = useState(null);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleChangeOTp = (e) => {
        setOtp(e.target.value);
    }

    const toggleShowPassword = (e) => {
        setShowPassword(!showPassword ? true : false);
    }

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        // Handle OTP verification
        if (!otp) {
            setMsg("OTP is required");
        } else if (otp.length !== 6) {
            setMsg("OTP must be six (6) characters");
        } else {
            setLoading(true);
            try {
                const response = await axios.post('/api/users/resetpassword/newpassword', { otp, email, password });
                setMsg(response.data.message);
                setLoading(false);
                setOtp('');
                router.push("/login");
            } catch (error) {
                setMsg(error.response.data.message);
                setLoading(false);
            }
        }


    };


    return (
        <Box component="div" className="mt-6" sx={{ maxWidth: matches ? "45%" : "95%", mx: "auto" }}>

            <Typography variant="h5" component="h5" className='text-center mb-2 text-black-200 font-extrabold'>Reset Password</Typography>

            <Typography variant="body1" className='text-center text-red-600 mb-2 text-black-200 font-extrabold'>{msg}</Typography>

            <form onSubmit={handleUpdatePassword} method="post">

                <TextField
                    name="otp"
                    label="OTP"
                    size="small"
                    type="number"
                    onChange={handleChangeOTp}
                    value={otp}
                    fullWidth
                    sx={{ mb: 1 }}
                    autoComplete='off'
                />

                <TextField
                    name="password"
                    label="Password"
                    size="small"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChangePassword}
                    value={password}
                    fullWidth
                    sx={{ mb: 1 }}
                    autoComplete='off'
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={toggleShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Button type="submit" fullWidth variant='contained' sx={{ backgroundColor: "#000" }}>
                    {loading ? "Loading..." : "Update Password"}
                </Button>
            </form>

        </Box >

    )
}

export default AddNewPassword;
