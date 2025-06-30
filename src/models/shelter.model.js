const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên trạm cứu hộ là bắt buộc"],
      trim: true,
    },
    shelterCode: {
      type: String,
      required: [true, "Mã trạm cứu hộ là bắt buộc"],
      unique: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ"],
    },
    hotline: {
      type: Number,
      required: [true, "Hotline là bắt buộc"],
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      lat: {
        type: Number,
        default: 0,
      },
      lng: {
        type: Number,
        default: 0,
      },
    },
    background: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/01/20/17/01/background-980970_1280.jpg",
    },
    members: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Thành viên cần có ID người dùng"],
        },
        roles: [
          {
            type: String,
            enum: {
              values: ["manager", "staff"],
              message: "Vai trò chỉ có thể là 'manager' hoặc 'staff'",
            },
            default: "staff",
            required: [true, "Vai trò của thành viên là bắt buộc"],
          },
        ],
      },
    ],
    invitations: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Người gửi lời mời là bắt buộc"],
        },
        receiver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Người nhận lời mời là bắt buộc"],
        },
        reason: {
          type: String,
          required: [true, "Phải có lý do"],
        },
        status: {
          type: String,
          enum: {
            values: ["pending", "accepted", "declined", "expired", "cancelled"],
            message: "Trạng thái lời mời không hợp lệ",
          },
          default: "pending",
        },
        expireAt: {
          type: Date,
          default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shelterLicense: {
      fileName: {
        type: String,
        required: [true, "Tên file giấy phép là bắt buộc"],
      },
      url: {
        type: String,
        required: [true, "Đường dẫn file giấy phép là bắt buộc"],
      },
      size: {
        type: Number,
      },
      mimeType: {
        type: String,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
      updateAt: {
        type: Date,
        default: Date.now,
      },
    },
    foundationDate: {
      type: Date,
      required: [true, "Ngày thành lập là bắt buộc"],
    },
    aspiration: {
      type: String,
      required: [true, "Nguyện vọng thành lập là bắt buộc"],
    },
    rejectReason: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ["verifying", "active", "banned", "rejected", "cancelled"],
        message: "Trạng thái không hợp lệ",
      },
      default: "verifying",
    },
    warningCount: {
      type: Number,
      default: 0,
      min: [0, "Số cảnh báo không thể âm"],
    },
  },
  { timestamps: true }
);

const Shelter = mongoose.model("Shelter", shelterSchema);
module.exports = Shelter;
