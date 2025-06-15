const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema(
  {
    species: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Species",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Breed = mongoose.model("Breed", breedSchema);
module.exports = Breed;
