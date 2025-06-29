const MedicalRecord = require("../models/medicalRecord.model");
const Pet = require("../models/pet.model");

const getAllPets = async () => {
  try {
    const pets = await Pet.find()
      .populate("species")
      .populate("breeds")
      .populate("shelter")
      .populate("adopter");
    return pets;
  } catch (error) {
    throw error;
  }
};

const viewPetDetails = async (petId) => {
  try {
    const pet = await Pet.findById(petId)
      .populate("species")
      .populate("breeds")
      .populate("shelter")
      .populate("adopter");
    return pet;
  } catch (error) {
    throw error;
  }
};

const createPet = async (petData) => {
  try {
    const pet = new Pet(petData);
    return await pet.save();
  } catch (error) {
    throw error;
  }
};

const updatePet = async (petId, updateData) => {
  try {
    return await Pet.findByIdAndUpdate(petId, updateData, { new: true });
  } catch (error) {
    throw error;
  }
};

const deletePet = async (petId) => {
  try {
    return await Pet.findByIdAndDelete(petId);
  } catch (error) {
    throw error;
  }
};

const getMedicalRecords = async (petId) => {
  try {
    const pet = await Pet.findById(petId);
    if (!pet) {
      throw new Error("Pet not found");
    }

    const records = await MedicalRecord.find({ pet: petId })
      .populate("performedBy", "fullName email")
      .sort({ procedureDate: -1 });

    return { pet, records };
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllPets,
  createPet,
  updatePet,
  viewPetDetails,
  deletePet,
  getMedicalRecords,
};
