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
          default: () => new mongoose.Types.ObjectId(),
      },
      availableFrom: {
        type: Date,
        required: true,
      },
      availableTo: {
        type: Date,
        required: true,
      },
      selectedSchedule: {
        type: Date,
      },
      scheduleAt: {
        type: Date,
      },
      method: {
        type: String,
        required: true,
      },
      feedback: {
        type: String,
      },
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      note: {
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
      enum: ["pending","scheduling", "interviewing", "approved", "rejected", "reviewed"],
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
