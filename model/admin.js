const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, default: "Admin" },
  },
  {
    timestamps: true,
  }
);
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
