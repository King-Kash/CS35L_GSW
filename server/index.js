import util from 'util';
util.isArray = Array.isArray;
import methodOverride from 'method-override'
import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

import userRouter from './routers/user_router.js'
import { fileURLToPath } from 'url';
import path from 'path';
import flash from 'express-flash';
import session from 'express-session';
import passport from 'passport';
import { checkAuthenticated, checkNotAuthenticated } from './middleware/auth.js';

//establish backend + connect to mongo
const app = express();

/// EJS rendering (comment out after testing)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
///

//req configurations
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //only for .ejs file

//passport sessions configuration
app.use(flash()) //used by passport.js
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//called mounting
//any time /user is appeneded to route, the routes specfically within userRouter can be used.
app.use("/users", userRouter);
app.get("/", checkAuthenticated, (req, res) => {
    res.render('index.ejs', {name: req.user.name})
});
app.delete('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
        return next(err);
    }
    res.redirect('/users/login')
  });
});
//establish connections
connectDB();
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});
