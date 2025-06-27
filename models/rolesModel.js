import mongoose from "mongoose";

const rolesSchema = mongoose.Schema(
    {
        role: {
            type: String,
            required: [true, 'Role name is required.'],
            trim: true
        },
        activated: {
            type: String,
            enum: ['0', '1'],
            default: '1'
        },
        deleted: {
            type: String,
            enum: ['0', '1'],
            default: '0'
        }
    },
    {
        timestamps: true
    }
)

export const Role = mongoose.model('Role', rolesSchema);