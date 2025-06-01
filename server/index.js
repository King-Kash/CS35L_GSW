import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDB } from './config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import User from './models/user_model.js';
import mongoose from 'mongoose';
import reviewRoutes from "./routers/review_router.js";
import locationRoutes from './routers/location_router.js';
import imageRoutes from './routers/image_router.js';


const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Allow both ports
  credentials: true
}));

app.use(express.json());

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
app.use('/api/images', imageRoutes);

app.get("/posts", authenticateToken, (req,res) => {
    res.json(posts)
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken}) //access token has user information saved in it
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            username,
            password: hashedPassword,
            bootysize: 0 // Default value, can be updated later
        });

        await user.save();

        // Create JWT token
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                username: user.username
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Test MongoDB connection
app.get('/test-db', async (req, res) => {
    try {
        // Check if we can connect to MongoDB
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ 
                status: 'error',
                message: 'MongoDB is not connected',
                connectionState: mongoose.connection.readyState
            });
        }

        // Try to create a test user
        const testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'test123',
            username: 'testuser',
            bootysize: 0
        });

        await testUser.save();

        // Try to find the test user
        const foundUser = await User.findOne({ email: 'test@test.com' });

        // Delete the test user
        await User.deleteOne({ email: 'test@test.com' });

        res.json({
            status: 'success',
            message: 'MongoDB is working correctly',
            testResults: {
                connectionState: mongoose.connection.readyState,
                userCreated: true,
                userFound: !!foundUser,
                userDeleted: true
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error testing MongoDB',
            error: error.message
        });
    }
});

const startServer = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
  });
};

startServer();