const petService = require("../services/pet.service");
const { cloudinary } = require("../configs/cloudinary");

const getAllPets = async (req, res) => {
  try {
    const pets = await petService.getAllPets();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewDetailPet = async (req, res) => {
  try {
    const pet = await petService.viewPetDetails(req.params.petId);
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createPet = async (req, res) => {
  try {
    const newPet = await petService.createPet(req.body);
    res.status(201).json(newPet);
  } catch (error) {
    console.error("CREATE PET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const pet = await petService.updatePet(req.params.id, req.body);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePet = async (req, res) => {
  try {
    const pet = await petService.deletePet(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicalRecords = async (req, res) => {
  try {
    const records = await petService.getMedicalRecords(req.params.petId);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pets",
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const petController = {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getMedicalRecords,
  viewDetailPet,
  uploadImage,
};

module.exports = petController;
