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
      },
    ],
    invitations: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },        
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'declined', "expired", "cancelled"],
            default: 'pending'
        },
        expireAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
        },   
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }   
    }],
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
    aspiration: {
      type: String,
      required: true,
    },
    rejectReason: {
      type: String
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
