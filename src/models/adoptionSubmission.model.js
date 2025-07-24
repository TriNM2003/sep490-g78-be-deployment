const mongoose = require("mongoose");

const adoptionSubmissionSchema = new mongoose.Schema(
  {
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adoptionForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdoptionForm",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selections: [
          {
            type: String,
          },
        ],
      },
    ],
     interview: {
      interviewId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      scheduleAt: Date,
      method: String,
      feedback: String,
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      note: String,
      createAt: {
        type: Date,
        default: Date.now,
      },
      updateAt: {
        type: Date,
        default: Date.now,
      },
    },
    adoptionsLastMonth: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "interviewing", "approved", "rejected", "reviewed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AdoptionSubmission = mongoose.model(
  "AdoptionSubmission",
  adoptionSubmissionSchema
);
module.exports = AdoptionSubmission;
