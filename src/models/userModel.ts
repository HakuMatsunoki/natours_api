import bcrypt from "bcryptjs";
// import crypto from "crypto";
import { model, Schema } from "mongoose";

import { appConfig } from "../configs";
import { ModelTableNames, Messages } from "../constants";

export interface UserObject {
  id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  passwd?: string;
  passwdChangedAt?: Date;
  passwdResetToken?: string;
  passwdResetExpires?: Date;
  active?: boolean;
  checkPasswd: (candidatePasswd: string) => Promise<boolean>;
}

const userSchema = new Schema<UserObject>(
  {
    name: {
      type: String,
      required: [true, Messages.NO_NAME],
      trim: true
    },
    email: {
      type: String,
      required: [true, Messages.NO_EMAIL],
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
      required: [true, Messages.NO_PASSWD],
      minlength: [8, Messages.INVALID_PASSWD],
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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next): Promise<void> {
  if (!this.isModified("passwd")) return next();

  this.passwd = await bcrypt.hash(this.passwd, appConfig.BCRYPT_COST);

  next();
});

userSchema.methods.checkPasswd = async function (
  candidatePasswd: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePasswd, this.passwd);
};

export const User = model<UserObject>(ModelTableNames.USER, userSchema);
