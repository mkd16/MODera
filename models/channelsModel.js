import mongoose, { Schema } from "mongoose";

const channelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Channel name is required.'],
            unique: true
        },
        handle: {
            type: String,
            required: [true, 'Channel handle is required.'],
            lowercase: true,
            unique: true
        },
        avatar: {
            type: String
        },
        banner: {
            type: String
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

export const Channel = mongoose.model('Channel', channelSchema);