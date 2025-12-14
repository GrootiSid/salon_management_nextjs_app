import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password?: string;
    role: "admin" | "staff";
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            enum: ["admin", "staff"],
            default: "admin",
        },
    },
    { timestamps: true }
);

// Prevent re-compilation
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
