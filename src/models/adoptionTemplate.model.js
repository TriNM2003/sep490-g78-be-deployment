const mongoose = require("mongoose");

const adoptionTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    species: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Species", 
      required: true,
      
    },
    description: {
      type: String,
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      required: true,
    },
    status: {
      type: String,
      enum: ["active"],
      default: "active",
    },
  },
  { timestamps: true }
);

const AdoptionTemplate = mongoose.model("AdoptionTemplate", adoptionTemplateSchema);
module.exports = AdoptionTemplate;
