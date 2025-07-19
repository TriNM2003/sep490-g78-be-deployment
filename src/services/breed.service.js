const {Breed, Species, Pet} = require("../models");


//USER


//ADMIN
const getAll = async () => {
  try {
    return await Breed.find({}).populate("species").sort({createdAt: -1});
  } catch (error) {
    throw error;
  }
};
const createBreed = async ({speciesId, breedName, breedDescription}) => {
  try {
    const species = await Species.findById(speciesId);
    if(!species){
        throw new Error("Loài không hợp lệ! Vui lòng chọn loài có trong hệ thống")
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
const deleteBreed = async (breedId) => {
  try {
    const breed = await Breed.findById(breedId);
    if(!breed){
        throw new Error("Giống không tồn tại");
    }

    // xoa breed
    await Breed.findByIdAndDelete(breedId);
    // xoa breed khoi cac pet dang su dung
    await Pet.updateMany({breeds: breedId}, {$pull: {breeds: breedId}})

    return {
      status: 200,
      message: `Xóa giống ${breed.name} thành công!`
    };
  } catch (error) {
    throw error;
  }
};

const breedService = {
  //USER
    

  //ADMIN
  getAll,
  createBreed,
  deleteBreed,
};

module.exports = breedService;