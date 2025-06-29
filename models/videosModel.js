import mongoose, { Schema } from "mongoose";

const videosSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Video title is required.']
        },
        videoUrl: {
            type: String,
            required: true
        },
        thumbnailUrl: {
            type: String,
            required: true
        },
        duration: {
            type: Number
        },
        visibility: {
            type: String,
            enum: ['public', 'private', 'unlisted'],
            default: 'public'
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        channelId: {
            type: Schema.Types.ObjectId,
            ref: "Channel",
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

export const Video = mongoose.model('Video', videosSchema);