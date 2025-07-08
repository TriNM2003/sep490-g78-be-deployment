const {Breed, Species} = require("../models");

const createBreed = async ({speciesId, breedName, breedDescription}) => {
  try {
    const species = await Species.findById(speciesId);
    if(!species){
        throw new Error("Không tìm thấy loài")
    }
    const isBreedExisted = await Breed.find({name: breedName})
    if(isBreedExisted){
        throw new Error("Giống đã tồn tại");
    }

    const newBreed = await Breed.create({
        species: speciesId,
        name: breedName,
        description: breedDescription
    })

    return newBreed;
  } catch (error) {
    throw error;
  }
};

const breedService = {
  //USER
    createBreed,

  //ADMIN
};

module.exports = breedService;