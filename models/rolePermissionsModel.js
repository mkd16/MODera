import mongoose from "mongoose";

import mongoose, { Schema } from "mongoose";

const rolePermissionSchema = mongoose.Schema(
    {
        roleId: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        permissionId: {
            type: Schema.Types.ObjectId,
            ref: 'Permission',
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

rolePermissionSchema.index({roleId: 1, permissionId: 1}, {unique: true})

export const RolePermission = mongoose.model('RolePermission', rolePermissionSchema);