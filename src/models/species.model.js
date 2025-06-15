const mongoose = require("mongoose");

const speciesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true } // tự động tạo createAt và updateAt
);

const Species = mongoose.model("Species", speciesSchema);
module.exports = Species;
