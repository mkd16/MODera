import mongoose, { Schema } from "mongoose";

const videoCommentSchema = mongoose.Schema(
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
        comment: {
            type: String, 
            required: [true, 'Comment cannot be empty.'],
            trim: true
        },
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: 'VideoComment'
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedReason: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

videoCommentSchema.index({videoId: 1, userId: 1}, {unique: true})
videoReactionSchema.index({userId: 1})

export const VideoComment = mongoose.model('VideoComment', videoCommentSchema);