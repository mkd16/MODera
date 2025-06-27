import mongoose from "mongoose";

const roleMappingModel = mongoose.Schema(
    {
        roleId: {
            type: String,
            required: [true, 'Assign a role to user.'],
            trim: true
        },
        userId: {
            type: String,
            required: [true, 'Select atlease 1 user.'],
            trim: true
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

export const Role = mongoose.model('Role', roleMappingModel);