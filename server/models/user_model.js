import mongoose from "mongoose";

//template for individual user documents
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
    },
    description: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        required: true,
    },
    bootysize: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true // createdAt, updatedAt
});

//User model
const User = mongoose.model('User', userSchema); //Singular and Capital for model name.
export default User;