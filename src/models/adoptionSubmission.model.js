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
