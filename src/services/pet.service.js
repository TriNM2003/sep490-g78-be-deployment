const MedicalRecord = require("../models/medicalRecord.model");
const Pet = require("../models/pet.model");
const db = require("../models/");
const Shelter = require("../models/shelter.model");

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
    // Lấy shelterCode từ shelter
    const shelter = await Shelter.findById(petData.shelter);
    if (!shelter) throw new Error("Shelter not found");

    const shelterCode = shelter.shelterCode;

    // Đếm số pet hiện có của shelter này
    const petCount = await Pet.countDocuments({ shelter: petData.shelter });

    // Sinh mã petCode mới
    const petCode = `${shelterCode}${petCount + 1}`;

    // Gán petCode vào petData
    petData.petCode = petCode;

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

const getPetList = async () => {
  try {
    const pets = await db.Pet.find()
      .populate("breeds")
      .populate("species")
      .populate("shelter")
      .populate("adopter");
    const result = pets.map((pet) => {
      return {
        _id: pet._id,
        name: pet.name,
        isMale: pet.isMale,
        age: pet.age,
        weight: pet.weight,
        identificationFeature: pet.identificationFeature,
        sterilizationStatus: pet.sterilizationStatus,
        species: {
          name: pet.species.name,
          description: pet.species.description,
        },
        breeds: pet.breeds.map((breed) => ({
          name: breed.name,
          description: breed.description,
        })),

        color: pet.color,
        bio: pet.bio,
        intakeTime: pet.intakeTime,
        photos: pet.photos,
        foundLocation: pet.foundLocation,
        tokenMoney: pet.tokenMoney,
        shelter: {
          name: pet.shelter.name,
          bio: pet.shelter.bio,
        },
        adopter: {
          _id: pet.adopter ? pet.adopter._id : null,
          fullName: pet.adopter ? pet.adopter.fullName : null,
        },
        status: pet.status,
      };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getPetById = async (petId) => {
  try {
    const pet = await db.Pet.findById(petId)
      .populate("breeds")
      .populate("species")
      .populate("shelter");
    if (!pet) {
      throw new Error("Pet not found");
    }
    return pet;
  } catch (error) {
    throw error;
  }
};

const getAdoptedPetbyUser = async (userId) => {
  try {
    const pets = await db.Pet.find({ adopter: userId })
      .populate("breeds")
      .populate("species")
      .populate("shelter")
      .populate("adopter");
    const result = pets.map((pet) => {
      return {
        _id: pet._id,
        name: pet.name,
        isMale: pet.isMale,
        age: pet.age,
        weight: pet.weight,
        identificationFeature: pet.identificationFeature,
        sterilizationStatus: pet.sterilizationStatus,
        species: {
          name: pet.species.name,
          description: pet.species.description,
        },
        breeds: pet.breeds.map((breed) => ({
          name: breed.name,
          description: breed.description,
        })),

        color: pet.color,
        bio: pet.bio,
        intakeTime: pet.intakeTime,
        photos: pet.photos,
        foundLocation: pet.foundLocation,
        tokenMoney: pet.tokenMoney,
        shelter: {
          name: pet.shelter.name,
          bio: pet.shelter.bio,
        },
        adopter: {
          _id: pet.adopter ? pet.adopter._id : null,
          fullName: pet.adopter ? pet.adopter.fullName : null,
        },
        status: pet.status,
      };
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const getMedicalRecordsByPet = async (petId, page = 1, limit = 3) => {
  const skip = (page - 1) * limit;
  const [records, total] = await Promise.all([
    MedicalRecord.find({ pet: petId })
      .populate("performedBy", "fullName email")
      .sort({ procedureDate: -1 })
      .skip(skip)
      .limit(limit),
    MedicalRecord.countDocuments({ pet: petId }),
  ]);
  return { records, total };
};

module.exports = {
  getAllPets,
  createPet,
  updatePet,
  viewPetDetails,
  deletePet,
  getMedicalRecords,
  getPetList,
  getPetById,
  getAdoptedPetbyUser,
  getMedicalRecordsByPet,
};
