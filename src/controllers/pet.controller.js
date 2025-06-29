const petService = require("../services/pet.service");

const getPetList = async (req, res) => {
  try {
    const pets = await petService.getPetList();
    return res.status(200).json(pets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getPetById = async (req, res) => {
  const { petId } = req.params;
  try {
    const pet = await petService.getPetById(petId);
    return res.status(200).json(pet);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAdoptedPetbyUser = async (req, res) => {
//   const userId = req.payload.id; // Assuming user ID is in the payload
  const userId = req.params.userId; // Assuming user ID is passed as a URL parameter
  try {
    const pets = await petService.getAdoptedPetbyUser(userId);
    return res.status(200).json(pets);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const petController = {
  getPetList,
  getPetById,
  getAdoptedPetbyUser,
};

module.exports = petController;
