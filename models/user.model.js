const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("node:crypto");
const { generateToken } = require("../service/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    profileImgUrl: {
      type: String,
      default: "/images/default.png",
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
  if (!this.isModified("password")) {
    return;
  }

  const salt = randomBytes(16).toString();
  const password = this.password;
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const salt = user.salt;
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== user.password) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user);
    return token;
  }
);

const User = model("User", userSchema);
module.exports = User;
