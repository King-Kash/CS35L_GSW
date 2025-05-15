import mongoose from "mongoose";
import { type } from "os";

//template for individual user documents
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    posts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    profile_pic: {
        type: String
    },

}, {
    timestamps: true // createdAt, updatedAt
});

//User model
const User = mongoose.model('User', userSchema); //Singular and Capital for model name.
export default User;