import Link from "next/link";

function Navbar() {
    return (
        <div>

            <div className="flex justify-between mx-4 py-3">

                <div className="">
                    <Link href="/">Home</Link>
                </div>
                <div className="flex gap-10">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                </div>

            </div>

        </div>
    )
}

export default Navbar