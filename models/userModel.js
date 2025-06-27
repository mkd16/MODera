import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'Username is required.'],
            trim: true,
            lowercase: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
        },
        profile: {
            type: String
        },
        twofaCode: {
            type: Number
        },
        verified: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: String,
            enum: ['0', '1'],
            default: '0'
        }
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model('User', userSchema);