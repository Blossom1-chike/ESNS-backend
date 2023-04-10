const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmergencyTypeSchema = new Schema(
  {
    color: { type: String, required: true, unique: true },
    type: { type: String, required: true, unique: true },
    defaultContact: { type: String, required: true },
    label: {type: String, required: true},
  },

  {
    timestamps: true,
  }
);
const EmergencyType = mongoose.model("emergencytype", EmergencyTypeSchema);

module.exports = EmergencyType;
