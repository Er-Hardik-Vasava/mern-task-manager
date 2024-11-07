import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registrationUser = async (req, res, next) => {
    const { name, username, email, phone, password } = req.body
    if (!name || !username || !email || !phone || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        })
    }

    const isAlreadyregistered = await User.findOne({ email });
    if (isAlreadyregistered) {
        return res.status(409).json({
            success: false,
            message: "User is Already Exist",
        })
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const createUser = await User.create({ name, username, email, phone, password: hashPassword })
    res.status(201).json({
        success: true,
        message: "User Register",
        createUser,
    })

}

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please Provide an email and password"
        })
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
    })

    return res.status(200).cookie("token", token, {
        httpOnly: true,
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
        ),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "User Login",
        user,
        token
    })
}

export const getUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(
            res.status(200).json({
                success: false,
                message: "User not found",
            })
        )
    }
    res.status(200).json({
        success: true,
        user,
    })
}

export const logOut = async (req, res, next) => {
    res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "User Logout"
    })
}