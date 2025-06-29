import mongoose from "mongoose";

import mongoose, { Schema } from "mongoose";

const permissionSchema = mongoose.Schema(
    {
        permission: {
            type: String,
            required: true,
            lowercase: true
        },
        description: {
            type: String,
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

export const Permission = mongoose.model('Permission', permissionSchema);