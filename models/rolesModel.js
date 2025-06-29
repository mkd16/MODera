import mongoose from "mongoose";

const roleSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'Role name is required.'],
            trim: true,
            unique: true
        },
        description: {
            type: String
        },
        activated: {
            type: Boolean,
            default: true
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

export const Role = mongoose.model('Role', roleSchema);