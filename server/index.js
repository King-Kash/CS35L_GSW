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
import cors from 'cors'

//establish backend + connect to mongo
import reviewRoutes from "./routers/review_router.js";
import locationRoutes from './routers/location_router.js';

const app = express();
app.use(express.json());
connectDB();

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
//This sets up express sessions (cookies)
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}))
//tells express to use passport on every request
app.use(passport.initialize())
//hooks passport onto express session
app.use(passport.session())
app.use(methodOverride('_method'))

//cors
app.use(cors({
    origin: 'http://localhost:5173',
    //credentials: true
}));

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

const posts = [
    {
        username: "Kash",
        title: "Post 1"
    },
    {
        username: "Aki",
        title: "Post 1"
    }
]

app.use(express.json()); // Middleware to parse JSON
app.use("/reviews", reviewRoutes); // Add review routes at /reviews
app.use("/locations", locationRoutes); // Add location routes at /locations

app.get("/posts", checkAuthenticated, (req,res) => {
    res.json(posts)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken}) //access token has user information saved in it
});


//establish connection
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});
