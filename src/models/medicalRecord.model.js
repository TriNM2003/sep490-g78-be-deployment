const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    type: {
      type: String,
      enum: ["vaccination", "surgery", "checkup", "treatment", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      default: 0,
      min: 0,
    },
    procedureDate: {
      type: Date,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
    photos: [
      {
        type: String,
        required: true
      },
    ],
    status: {
      type: String,
      enum: ["availabled", "disabled"],
      default: "availabled",
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
module.exports = MedicalRecord;
