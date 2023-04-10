const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const EmergencyHistorySchema = new Schema(
  {
    user: { type: ObjectId, required: true, ref: "user" },
    type: { type: ObjectId, required: true, ref: "type" },
  },
  {
    timestamps: true,
  }
);
const EmergencyHistory = mongoose.model(
  "EmergencyHistory",
  EmergencyHistorySchema
);

module.exports = EmergencyHistory;
