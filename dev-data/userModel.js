const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
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
    unique: [true, "This account already exist"]
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
  password: {
    type: String,
    required: [true, "User must have an password"],
    minlength: [8, "password should be at least 8 characters long"],
    select: false
  },
  passwordChangedAt: {
    type: Date
    // required: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

// START comment this, when impporting user data from json to db
userSchema.pre("save", async function (next) {
  // ony run function if passwd was actually modified
  if (!this.isModified("password")) return next();
  // hash passwd with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwd confirm field
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
//======================= END

userSchema.pre(/^find/, function (next) {
  // this points to the current querry
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(this.passwordChangedAt, JWTTimestamp);
    // console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp; // token issued < passwd changed
  }

  // not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // console.log({ resetToken }, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
