

import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    username: {
        type: String,
        required: [true, "username required"]
    },
    email: {
        type: String,
        required: [true, "email required"]
    },
    password: {
        type: String,
        required: [true, "password required"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    
    forgetpassToken: String,
    forgetpassTokenExpiry: Date,

    verifyToken: String,
    verifyTokenExpiry: Date,


})


const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User

