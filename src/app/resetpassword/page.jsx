"use client";
import { useState } from 'react';
import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material'
import axios from 'axios';

import { useRouter } from 'next/navigation';

const ResetPassword = () => {

    const router = useRouter();
    const matches = useMediaQuery('(min-width:650px)');

    const [msg, setMsg] = useState(null);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    }

    const sendEmail = async (e) => {
        e.preventDefault();
        if (email) {
            setLoading(true);
            try {
                const response = await axios.post('/api/users/resetpassword/generatetoken', { email });
                console.log(response.data.message);
                setMsg(response.data.message)
                setLoading(false);
                localStorage.setItem('email', email);

                setTimeout(() => {
                    router.push('resetpassword/newpassword');
                    setMsg(null);
                }, 5000);

            } catch (error) {
                console.error(error);
                setMsg(error.response.data.message);
                setLoading(false);
            }
        }
        else {
            setMsg("Email Required");
        }

    }

    return (
        <Box component="div" className="mt-6" sx={{ maxWidth: matches ? "45%" : "95%", mx: "auto" }}>

            <Typography variant="h5" component="h5" className='text-center mb-2 text-black-200 font-extrabold'>Reset Password</Typography>

            <Typography variant="body1" className='text-center text-red-600 mb-2 text-black-200 font-extrabold'>{msg}</Typography>

            <form onSubmit={sendEmail} method="post">
                <TextField
                    name="email"
                    label="Email"
                    size="small"
                    type='email'
                    onChange={handleInputChange}
                    value={email}
                    fullWidth
                    sx={{ mb: 1 }}
                    autoComplete='off'
                />

                <Button type="submit" fullWidth variant='contained' sx={{ backgroundColor: "#000" }}>
                    {loading ? "Loading..." : "get verification code"}
                </Button>

            </form>

        </Box>

    )
}

export default ResetPassword