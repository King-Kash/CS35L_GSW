import {Strategy as LocalStrategy} from 'passport-local' 
import bcrypt from "bcrypt"
import mongoose from "mongoose";


function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email) //change to mongoose findOne function using eamil
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
    passport.serializeUser((user, done) => done(null, user.id))    
    passport.deserializeUser((id, done) => {
            try {
                const user = getUserById(id)
                return done(null, user) //might have to change this
            } catch (error) {
                return done(error);
            }
        })
}

export default initialize;
