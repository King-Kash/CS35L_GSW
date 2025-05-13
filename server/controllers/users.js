import mongoose from "mongoose";
import User from "../models/user_model.js";
import bcrypt from "bcrypt"

const users = []

const getUsers = async (req, res) => {
    res.json(users)
}

const login = async (req, res) => {
    /*TODO*/
}

/* TODO */
const signup = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = { username: req.body.username, password: hashedPassword}
        users.push(user)
        res.status(201).send()  
    } catch (err) {
        console.error(err)
        res.status(500).send(err.message)
    }
}

export {
    login,
    getUsers,
    signup,
}


// const createUser = async (req, res) => {
//     const user_info = req.body;

//     if(!user_info.name || !user_info.username || !user_info.bootsize) {
//         return res.status(400).json({success:false, message: "Provide all fields. Espicially the user's BOOTY SIZE."})
//     };

//     const newUser = new User(user_info);

//     try {
//         await newUser.save();
//         res.status(400).json({success: true, data: newUser});
//     } catch (error) {
//         console.error("Error is creating user, please chek you included Booty Size:", error.message);
//     }
// }
