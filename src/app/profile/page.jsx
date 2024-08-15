import { useState } from "react"

const Profile = () => {

    const [userdata, setUserData] = useState("");

    const fetchUser = async () => {

        const email = localStorage.getItem("email");

        try {

            const response = await axios.post("api/profile" ,email );
            console.log(response);
        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <div>Profile</div>
    )
}

export default Profile