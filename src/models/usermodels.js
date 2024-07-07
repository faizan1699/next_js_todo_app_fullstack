import mongoose from "mongoose";

const userSchema = mongoose.Schema({

  username: {
    type: String,
    required: [true, "username required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email required"],
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  resetPasswordToken: String,
  resetPasswordExpiry: { type: Date },

  verifyToken: String,
  verifyTokenExpiry: {
    type: Date,
  },
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
