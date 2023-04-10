//import the mongoose module
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String },
    role: { type: String, default: "User" },
    verified: { type: Boolean, default: false },
    contacts: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("user", UserSchema);

module.exports = User;
