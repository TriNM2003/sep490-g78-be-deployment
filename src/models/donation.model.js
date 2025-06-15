const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    
  },
  { timestamps: true } 
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
