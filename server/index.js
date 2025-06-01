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
import imageRoutes from './routers/image_router.js';
import searchRoutes from './routers/search_router.js';


const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
  credentials: true
}));

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


//cors
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true //needed for cookies to go back and forth
}));

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



//called mounting
//any time /user is appeneded to route, the routes specfically within userRouter can be used.
app.use("/users", userRouter);
//or you can just define the route and the function in index.js
app.get("/api/auth/status", (req, res) => {
    if(req.isAuthenticated())
    {
        res.status(200).json({authenticated: true, user: {name: req.user.name, id: req.user.id}})
    } 
    else
    {
        res.status(401).json({authenticated: false})
    }
});

app.delete('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
        return next(err);
    }
  });
});

app.use(express.json()); // Middleware to parse JSON
app.use("/reviews", reviewRoutes); // Add review routes at /reviews
app.use("/locations", locationRoutes); // Add location routes at /locations
app.use('/api/images', imageRoutes);
app.use("/search", searchRoutes); // Add search routes at /search
app.use("/recommendations", checkAuthenticated, searchRoutes); // Add recommendations routes with auth

// app.get("/posts", checkAuthenticated, (req,res) => {
//     res.json(posts)
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
//     res.json({accessToken: accessToken}) //access token has user information saved in it
// });



//establish connection
app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});
