const Breed = require("../models/breed.model");
const breedService = require("../services/breed.service");

const getAllBreeds = async (req, res) => {
  try {
    const breeds = await Breed.find();
    res.status(200).json(breeds);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createBreed = async (req, res) => {
  try {
    const {speciesId, breedName, breedDescription} = req.body;
    const newBreed = await breedService.createBreed(speciesId, breedName, breedDescription);
    res.status(200).json(newBreed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const breedController = {
  // USER
  getAllBreeds,
  createBreed,

  //ADMIN
}

module.exports = breedController;
