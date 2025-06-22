const { Schema, model } = require("mongoose");
const {randomBytes, createHmac} = require("node:crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if(!this.isModified("password")) {
    return next();
  }

  const salt = randomBytes(16);
  const password = this.password;
  const hashedPassword = createHmac("sha256", salt)
                          .update(password)
                          .digest("hex");

  this.salt = salt
  this.password = hashedPassword;
  return next();
})

const User = model("User", userSchema);
module.exports = User;