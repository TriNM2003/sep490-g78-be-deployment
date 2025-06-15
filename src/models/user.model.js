const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function (value) {
          return !/\s/.test(value);
        },
        message: "Password không được chứa khoảng trắng!",
      },
    },
    googleId: {
      type: String,
      sparse: true
    },
    fullName: {
      type: String,
      match: /^[a-zA-ZÀ-Ỹà-ỹ\s]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
    },
    bio: {
      type: String,
    },
    phoneNumber: {
      type: String,
      match: /^(0[3|5|7|8|9])+([0-9]{8})$/,
    },
    background: {
      type: String,
      default: ""
    },
    roles: [
      {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
    ],
    status: {
      type: String,
      enum: ["verifying", "active", "banned"],
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

const User = mongoose.model("User", userSchema);
module.exports = User;
