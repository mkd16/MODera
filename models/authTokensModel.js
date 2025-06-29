import mongoose, { Schema } from "mongoose";

const authTokenSchema = mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Select atlease 1 user.'],
            trim: true
        },
        type: {
            type: String,
            enum: ['verification', 'forgot_password', 'refresh_token'],
        },
        token: {
            type: String,
        },
        used: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

authTokenSchema.index({userId: 1})

export const AuthToken = mongoose.model('AuthToken', authTokenSchema);