const db = require("../models/");

const getPetList = async () => {
    try {
        const pets = await db.Pet.find().populate("breeds").populate("species").populate("shelter").populate("adopter");
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
}

const getPetById = async (petId) => {
    try {
        const pet = await db.Pet.findById(petId).populate("breeds").populate("species").populate("shelter");
        if (!pet) {
            throw new Error("Pet not found");
        }
        return pet;
    } catch (error) {
        throw error;    
    }
}


const getAdoptedPetbyUser = async (userId) => {
    try {
        const pets = await db.Pet.find({ adopter: userId }).populate("breeds").populate("species").populate("shelter").populate("adopter");
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
}



const petService = {
    getPetList,
    getPetById,
    getAdoptedPetbyUser,
}

module.exports = petService;