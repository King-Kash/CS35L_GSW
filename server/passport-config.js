import {Strategy as LocalStrategy} from 'passport-local' 
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import User from './models/user_model.js';


function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await User.findOne({email}) //change to mongoose findOne function using eamil
        if (!user) {
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
    passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id).select('-password') //prevents password from getting exposed
                return done(null, user) //might have to change this
            } catch (error) {
                return done(error);
            }
        })
}

export default initialize;
