"use client";
// pages/verifyemail.js

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [msg, setMsg] = useState(null);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post('/api/users/verifyemail', { token });
            setVerified(true);
            setMsg(response.data.message);
        } catch (error) {
            setVerified(false);
            console.log("error from verify email frontend", error);
            setMsg(error.response.data.message);
        }
        setTimeout(() => {
            setMsg(null);
        }, 15000);
    };

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <h2 className="text-4xl mb-8">Verify Email</h2>

            {msg && (
                <h6 className="p-2 bg-red-500 my-2 text-white rounded-lg">{msg}</h6>
            )}

            <h2 className="p-2 bg-orange-500 text-black mb-8">{token ? `${token}` : "No token"}</h2>

            {verified ? (
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Email Verified Successfully!</h2>
                    <Link href="/login">
                        <p className="text-blue-500 hover:underline">Login</p>
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-white p-4 rounded-lg">Error Verifying Email</h2>
                </div>
            )}
        </div>
    );
}
