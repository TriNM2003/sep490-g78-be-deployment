const Breed = require("../models/breed.model");

const getAllBreeds = async (req, res) => {
  try {
    const breeds = await Breed.find();
    res.status(200).json(breeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllBreeds };
