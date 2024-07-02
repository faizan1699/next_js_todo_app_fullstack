"use client";
import axios from "axios";
import Link from "next/link";

import { useRouter } from 'next/navigation';

function Navbar() {

    const router = useRouter();
    const onLogout = async () => {

        try {

            const response = await axios.get("/api/users/auth/logout");
            console.log(response.data.message);
            alert(response.data.message);
            router.push('/login');
        }
        catch (error) {
            console.log(error);
        }

    }

    return (
        <div>
            <div className="flex justify-between mx-4 py-3">

                <div>
                    <Link href="/">Todo App</Link>
                </div>

                <div className="flex gap-10" style={{color: "green" , background:"yellow" }}>
                    <Link href="/home">Home</Link>
                    <Link href="/login">Login</Link>
                    <Link href="/bank">Bank</Link>
                    <Link href="/register">Register</Link>
                    <button onClick={onLogout}>Log Out</button>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
