import mongoose from "mongoose";
import { type } from "os";

//template for individual user documents
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    bootysize: {
        type: Number,
        min: 0,
    },
    id: {
        type: String,
    },
    followers: {
        type: Array,
        required: true,
        default: [],
    },
    following: {
        type: Array,
        required: true,
        default: [],
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    posts: {
        type: JSON
    },
    profile_pic: {
        type: String
    },

}, {
    timestamps: true // createdAt, updatedAt
});

//User model
const Users = mongoose.model('User', userSchema); //Singular and Capital for model name.
export default Users;