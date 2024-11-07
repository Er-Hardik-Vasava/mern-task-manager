import mongoose from "mongoose";
import validator from "validator"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "Provide a Valid Email!"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)