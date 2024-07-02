"use client";

import { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material'
import axios from 'axios';

import { useRouter } from 'next/navigation';

const AddNewPassword = () => {

    const router = useRouter();
    const matches = useMediaQuery('(min-width:650px)');

    const email = localStorage.email;

    const [msg, setMsg] = useState(null);
    const [otp, setOtp] = useState('636459');
    const [loading, setLoading] = useState(false);

    const handleChangeOTp = (e) => {
        setOtp(e.target.value);
    }

    const handleOtpVerify = async (e) => {
        e.preventDefault();

        if (!otp) {
            setMsg("OTP is required");
        } else if (otp.length !== 6) {
            setMsg("OTP must be six (6) characters");
        } else {
            setLoading(true);
            try {
                const response = await axios.post('/api/users/otpverify', { otp, email });
                setMsg(response.data.message);
                setLoading(false);
                console.log("Response from verify email frontend:", response);
            } catch (error) {
                console.log("Error from verify email frontend:", error);
                setMsg(error.message);
                setLoading(false);
            }
        }
    }

    return (
        <Box component="div" className="mt-6" sx={{ maxWidth: matches ? "45%" : "95%", mx: "auto" }}>

            <Typography variant="h5" component="h5" className='text-center mb-2 text-black-200 font-extrabold'>Reset Password</Typography>

            <Typography variant="body1" className='text-center text-red-600 mb-2 text-black-200 font-extrabold'>{msg}</Typography>

            <form onSubmit={handleOtpVerify} method="post">
                <TextField
                    name="otp"
                    label="OTP"
                    size="small"
                    type='number'
                    onChange={handleChangeOTp}
                    value={otp}
                    fullWidth
                    sx={{ mb: 1 }}
                    autoComplete='off'
                />

                <Button type="submit" fullWidth variant='contained' sx={{ backgroundColor: "#000" }}>
                    {loading ? "Loading..." : "Verify OTP"}
                </Button>
            </form>
        </Box>
    )
}

export default AddNewPassword;
