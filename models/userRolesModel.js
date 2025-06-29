import mongoose, { Schema } from "mongoose";

const userRoleSchema = mongoose.Schema(
    {
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: [true, 'Assign a role to user.'],
            trim: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Select atlease 1 user.'],
            trim: true
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

userRoleSchema.index({roleId: 1, userId: 1}, {unique: true})
channelNotificationSchema.index({userId: 1})

export const UserRole = mongoose.model('UserRole', userRoleSchema);