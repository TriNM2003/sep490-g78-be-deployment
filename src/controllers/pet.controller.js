const petService = require('../services/pet.service');

const getPetListByShelter = async (req, res) => {
    const { shelterId } = req.params;
    try {
        const pets = await petService.getPetListByShelter(shelterId);
        return res.status(200).json(pets);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getPetById = async (req, res) => {
    const { petId } = req.params;
    try {
        const pet = await petService.getPetById(petId);
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const petController = {
    getPetListByShelter,
    getPetById
}

module.exports = petController;