import mongoose from "mongoose";
import User from "../models/user_model.js";
import bcrypt from "bcrypt"
import passport from "passport";
import initializePassport from "../passport-config.js"


const users = []

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)

)


const getUsers = async (req, res) => {
    res.json(users)
}

const login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
   })

const renderlogin = (req, res) => {
    res.render('login.ejs')
}

/* TODO */
const signup = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const user = { id: Date.now().toString(), email: req.body.email, name: req.body.name, password: hashedPassword}
        users.push(user)
        res.redirect('/users/login')
    } catch (err) {
        console.error(err)
        res.redirect('/users/signup')
        res.status(500).send(err.message)
    }
     console.log(users)
}

const rendersignup = (req, res) => {
    res.render('register.ejs')
}

export {
    login,
    renderlogin,
    getUsers,
    signup,
    rendersignup,
}

