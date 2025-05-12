import mongoose from "mongoose";
import User from "../models/user_model.js";

const users = []

const getUsers = async (req, res) => {
    res.json(users)
}

const login = async (req, res) => {
    const user = { username: req.body.name, password: req.body.password}
    users.push(user)
    res.status(201).send()
}

export {
    login,
    getUsers,
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
