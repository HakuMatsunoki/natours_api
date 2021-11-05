import bcrypt from "bcryptjs";
// import crypto from "crypto";
import { model, Schema } from "mongoose";

import { ModelTableNames } from "../constants";

export interface UserObj {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  passwd: string;
  passwdChangedAt?: Date | undefined;
  passwdResetToken?: string | undefined;
  passwdResetExpires?: Date | undefined;
  active: boolean;
}

const userSchema: Schema = new Schema<UserObj>({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    trim: true,
    lowercase: true,
    unique: true
  },
  photo: {
    type: String,
    default: "default.jpg"
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user"
  },
  passwd: {
    type: String,
    required: [true, "User must have an password"],
    minlength: [8, "password should be at least 8 characters long"],
    select: false
  },
  passwdChangedAt: Date,
  passwdResetToken: String,
  passwdResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("passwd")) return next();

  this.passwd = await bcrypt.hash(this.passwd, 12);

  next();
});

export const User = model<UserObj>(ModelTableNames.USER, userSchema);
