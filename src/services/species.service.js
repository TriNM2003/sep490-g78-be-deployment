const {Species, Breed} = require("../models");


//USER

//ADMIN
const getAll = async () => {
  try {
    return await Species.find().sort({createdAt: -1});
  } catch (error) {
    throw error;
  }
};
const createSpecies = async (name, description) => {
  try {
    const species = await Species.find({
      $or: [{ name: name }, { description: description }],
    });
    if(!species){
      throw new Error("Tên loài đã tồn tại hoặc miêu tả bị trùng với loài khác!")
    }
    const newSpecies = await Species.create({
      name,
      description
    })
    return newSpecies;
  } catch (error) {
    throw error;
  }
};
const deleteSpecies = async (speciesId) => {
  try {
    const species = await Species.findById(speciesId);
    if(!species){
      throw new Error("Id của loài không hợp lệ!")
    }

    // Xoa species
    await Species.findByIdAndDelete(speciesId)
    // Xoa cac breed thuoc species
    await Breed.deleteMany({species: speciesId});
    
    return {
      message: "Xóa loài thành công!"
    };
  } catch (error) {
    throw error;
  }
};

const speciesService = {
  //USER


  //ADMIN
  getAll,
  createSpecies,
  deleteSpecies,
};

module.exports = speciesService;