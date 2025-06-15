const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receivers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    type: [
      {
        type: String,
        enum: ["system", "adoption", "message", "report", "other"], 
        required: true,
      },
    ],
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true } 
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
