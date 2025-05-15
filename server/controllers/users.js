import mongoose from "mongoose";
import User from "../models/user_model.js";
import bcrypt from "bcrypt"
import passport from "passport";
import initializePassport from "../passport-config.js"


initializePassport(
    passport,
    async email => User.findOne({email}),
    async id => User.findById({id})
)


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
        const newUser = new User({ email: req.body.email, name: req.body.name, password: hashedPassword})
        await newUser.save()
        res.redirect('/users/login')
    } catch (err) {
        console.error(err)
        res.redirect('/users/signup')
    }
}

const rendersignup = (req, res) => {
    res.render('register.ejs')
}

export {
    login,
    renderlogin,
    signup,
    rendersignup,
}

