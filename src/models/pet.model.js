const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isMale: {
      type: Boolean,
      required: true,
    },
    age: { // Age in months
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    identificationFeature:{
      type:String,
    },
    sterilizationStatus:{
      type:Boolean,// tinh trang triet san
    },
    species: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Species", 
    },
    breeds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Breed",
    }],
    color: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
    },
    intakeTime: {
      type: Date,
      default: Date.now,
    },
    photos: [
      {
        type: String,
      },
    ],
    foundLocation: {
      type: String,
      trim: true,
    },
    tokenMoney: {
      type: Number,
      default: 0,
      min: 0,
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shelter",
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["unavailable", "available", "adopted", "disabled", "booking","delivered"],
      default: "unavailable",
    },
  },
  { timestamps: true } 
);

const Pet = mongoose.model("Pet", petSchema);
module.exports = Pet;
