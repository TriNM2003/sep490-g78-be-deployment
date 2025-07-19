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



//ADMIN
const getAll = async (req, res) => {
  try {
    const breeds = await breedService.getAll();
    res.status(200).json(breeds);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createBreed = async (req, res) => {
  try {
    const {speciesId, name, description} = req.body;
    const newBreed = await breedService.createBreed(speciesId, name, description);
    res.status(200).json(newBreed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteBreed = async (req, res) => {
  try {
    const {breedId} = req.params;
    const response = await breedService.deleteBreed(breedId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const breedController = {
  // USER
  getAllBreeds,
  

  //ADMIN
  getAll,
  createBreed,
  deleteBreed,
}

module.exports = breedController;
