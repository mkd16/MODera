import mongoose from "mongoose";

const authTokenSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, 'Select atlease 1 user.'],
            trim: true
        },
        type: {
            type: String,
            enum: ['verification', 'forgot_password', 'refresh_token'],
        },
        deleted: {
            type: String,
            enum: ['0', '1'],
            default: '0'
        },
        used: {
            type: String,
            enum: ['0', '1'],
            default: '0'
        },
        token: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

export const AuthToken = mongoose.model('AuthToken', authTokenSchema);