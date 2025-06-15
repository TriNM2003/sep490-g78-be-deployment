const mongoose = require("mongoose");


const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        fileName: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
        mimeType: { type: String },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } 
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
