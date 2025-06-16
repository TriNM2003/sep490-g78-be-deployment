const db = require("../models/");

const getPetListByShelter = async (shelterId) => {
    try {
        const pets = await db.Pet.find({ shelter: shelterId }).populate("breeds").populate("species").populate("shelter");
        return pets;
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

const petService = {
    getPetListByShelter,
    getPetById
}

module.exports = petService;