import mongoose, { Schema } from "mongoose";

const videoReactionSchema = mongoose.Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reaction: {
            type: String,
            required: true,
            enum: ['Like', 'Dislike']
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

videoReactionSchema.index({videoId: 1, userId: 1}, {unique: true})
videoReactionSchema.index({userId: 1})

export const VideoReaction = mongoose.model('VideoReaction', videoReactionSchema);