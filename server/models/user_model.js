import mongoose from "mongoose";

//template for individual user documents
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    bootySize: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true // createdAt, updatedAt
});

//User model
const User = mongoose.model('User', userSchema); //Singular and Capital for model name.
export default User;