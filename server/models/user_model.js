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
    searchHistory: [{
        searchTerm: String,
        tags: [String],
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    viewedLocations: [{
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
        viewCount: {
            type: Number,
            default: 1
        },
        lastViewed: {
            type: Date,
            default: Date.now
        }
    }],
    preferences: {
        preferredTags: [String],
        avgRatingGiven: {
            type: Number,
            default: 0
        }
    },
    pinnedLocations: [{
        location: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location'
        },
        pinnedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true // createdAt, updatedAt
});

//User model
const User = mongoose.model('User', userSchema); //Singular and Capital for model name.
export default User;