import mongoose from "mongoose";

import mongoose, { Schema } from "mongoose";

const channelSubscriptionSchema = mongoose.Schema(
    {
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
        }
    },
    {
        timestamps: true
    }
)

channelSubscriptionSchema.index({subscriberId: 1, channelId: 1}, {unique: true})
videoReactionSchema.index({subscriberId: 1})

export const ChannelSubscription = mongoose.model('ChannelSubscription', channelSubscriptionSchema);