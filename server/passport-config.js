import {Strategy as LocalStrategy} from 'passport-local' 
import bcrypt from "bcrypt"
import mongoose from "mongoose";


function initializePassport(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email) //change to mongoose findOne function using eamil
        if (user == null) {
            return done(null, false, {message: 'No user with that email'}) //replace null with database error 
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email', passwordField: 'password'}, authenticateUser))
    passport.seralizeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserByID(id)) //might have to change this
    })
}