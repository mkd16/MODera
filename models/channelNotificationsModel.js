import mongoose from "mongoose";

import mongoose, { Schema } from "mongoose";

const channelNotificationSchema = mongoose.Schema(
    {
        videoId: {
            type: Schema.Types.ObjectId,
            ref: 'Video',
            required: true
        },
        subscriberId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        channelId: {
            type: Schema.Types.ObjectId,
            ref: 'Channel',
            required: true
        },
        deleted: {
            type: Boolean,
            default: false
        },
        processed: {
            type: Boolean,
            default: false
        },
        error: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

channelNotificationSchema.index({videoId: 1})
channelNotificationSchema.index({subscriberId: 1})

export const ChannelNotification = mongoose.model('ChannelNotification', channelNotificationSchema);