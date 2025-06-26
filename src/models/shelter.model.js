const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shelterCode: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    hotline: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    },
    address: {
      type: String
    },
    background: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/01/20/17/01/background-980970_1280.jpg",
    },
    members: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        roles: [
          {
            type: String,
            enum: ["manager", "staff"],
            default: "staff",
            required: true,
          },
        ],
        joinMethod: {
          type: String,
          enum: ["invited", "requested", "created"], // phan biet loi moi vao shelter va yeu cau vao shelter
        },
        status: {
          type: String,
          enum: ["active", "rejected", "left", "pending"], // trang thai cua thanh vien: hoat dong, tu choi vao shelter, da roi khoi shelter, dang cho xu ly yeu cau
        }
      },
    ],
    shelterLicense: //update schema license
    {    
        fileName: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: Number },
        mimeType: { type: String },
        createAt: { type: Date, default: Date.now },
        updateAt: { type: Date, default: Date.now },
    },
    foundationDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["verifying", "active", "banned", "rejected"],
      default: "verifying",
    },
    warningCount: {
      type: Number,
      default: 0,
      min: 0,
      //warningCount = 3 => status = "banned",
    },
  },
  { timestamps: true }
);

const Shelter = mongoose.model("Shelter", shelterSchema);
module.exports = Shelter;
