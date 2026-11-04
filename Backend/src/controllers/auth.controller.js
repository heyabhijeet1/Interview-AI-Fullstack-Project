const userModel=require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')
const mongoose = require('mongoose')
const interviewReportModel = require('../models/interviewReport.model')

const isProduction = process.env.NODE_ENV === "production"
const authCookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
}

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req,res) {
    const username = typeof req.body.username === "string" ? req.body.username.trim() : ""
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
    const { password } = req.body

    if ( !username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }
    const doesUserAlreadyExist = await userModel.findOne({
        $or: [
            { $expr: { $eq: [{ $toLower: "$username" }, username.toLowerCase()] } },
            { $expr: { $eq: [{ $toLower: "$email" }, email] } }
        ]
    })

    if (doesUserAlreadyExist){
        return res.status(400).json({
            message: "Account already exists with this email address or username"
        })
    }

    let guestSession = null
    const guestToken = req.cookies?.token
    if (guestToken) {
        try {
            const decoded = jwt.verify(guestToken, process.env.JWT_SECRET)
            const isBlacklisted = await tokenBlacklistModel.exists({ token: guestToken })
            if (decoded.isGuest && !isBlacklisted && mongoose.Types.ObjectId.isValid(decoded.id)) {
                guestSession = decoded
            }
        } catch {
            // An expired or invalid guest cookie should not prevent account creation.
        }
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    // Move guest reports to the new account and remove their temporary expiry.
    if (guestSession) {
        await interviewReportModel.updateMany(
            { user: new mongoose.Types.ObjectId(guestSession.id) },
            { $set: { user: user._id }, $unset: { guestExpiresAt: "" } }
        )
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token", token, authCookieOptions)

    res.status(201).json({
        message: "User registered succcesfully",
        id: user._id,
        username: user.username,
        email: user.email
    })
    

}

async function loginUserController(req,res){
    const email = typeof req.body.email === "string" ? req.body.email.trim() : ""
    const { password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." })
    }
    const user = await userModel.findOne({
        $expr: { $eq: [{ $toLower: "$email" }, email.toLowerCase()] }
    })
    
    if (!user){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie('token', token, authCookieOptions)
    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function guestLoginController(req, res) {
    const guestId = new mongoose.Types.ObjectId()
    const token = jwt.sign(
        { id: guestId, username: "Guest", isGuest: true },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token, authCookieOptions)
    return res.status(200).json({
        message: "Guest session started successfully.",
        user: { id: guestId, username: "Guest", isGuest: true }
    })
}

async function logoutUserController(req,res) {
    const token = req.cookies.token
    if (token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token", authCookieOptions)

    res.status(200).json({
        message: "User logged out successfully"
    })
}

async function  getMeController(req,res) {
    if (req.user.isGuest) {
        return res.status(200).json({
            message: "Guest session fetched successfully.",
            user: { id: req.user.id, username: "Guest", isGuest: true }
        })
    }

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "user details fetched succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports={
    registerUserController, loginUserController, guestLoginController, logoutUserController, getMeController
}
