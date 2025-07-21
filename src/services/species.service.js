const {Species, Breed, Pet} = require("../models");

async function sendNotificationToAllShelter(senderId, message){
  try {
    const shelters = await Shelter.find({status: "active"});
    const allMemberIds = shelters.flatMap((shelter) =>
      shelter.members.map((member) => member._id)
    );
    if(shelters.length > 0){
        createNotification(senderId, allMemberIds, message, "system", "");
    }
  } catch (error) {
    throw error;
  }
}

//USER

//ADMIN
const getAll = async () => {
  try {
    return await Species.find().sort({createdAt: -1});
  } catch (error) {
    throw error;
  }
};
const createSpecies = async (adminId, name, description) => {
  try {
    const species = await Species.findOne({name: name});
    if(species){
      throw new Error("Loài đã tồn tại!")
    }
    const newSpecies = await Species.create({
      name,
      description
    })

    // gui thong bao cho tat ca shelter
    await sendNotificationToAllShelter(adminId, `Loài ${name} vừa được thêm vào hệ thống!`)

    return newSpecies;
  } catch (error) {
    throw error;
  }
};
const editSpecies = async (adminId, speciesId, name, description) => {
  try {
    const species = await Species.findById(speciesId);
    if(!species){
      throw new Error("Loài không tồn tại!")
    }
    await Species.findByIdAndUpdate(speciesId, {
      name,
      description
    })

    // gui thong bao cho tat ca shelter
    await sendNotificationToAllShelter(adminId, `Loài ${species.name} vừa được cập nhập!`)

    return {
      message: "Chỉnh sửa loài thành công!"
    };
  } catch (error) {
    throw error;
  }
};
const deleteSpecies = async (adminId, speciesId, differentSpeciesId) => {
  try {
    if(speciesId === differentSpeciesId){
      throw new Error("Iđ của loài xóa đi và loài để chuyển sang trùng nhau");
    }

    const species = await Species.findById(speciesId);
    if (!species) {
      throw new Error("Id của loài không hợp lệ!");
    }

    const differentSpecies = await Species.findById(differentSpeciesId);
    if (!differentSpecies) {
      throw new Error("Id của loài để chuyển sang không hợp lệ!");
    }

    // Chuyển các breed sang loài mới
    await Breed.updateMany(
      { species: speciesId },
      { $set: { species: differentSpeciesId } }
    );

    // Chuyển các pet sang loài mới
    await Pet.updateMany(
      { species: speciesId },
      { $set: { species: differentSpeciesId } }
    );

    // Xoá species
    await Species.findByIdAndDelete(speciesId);

    // gui thong bao cho tat ca shelter
    await sendNotificationToAllShelter(adminId, `Loài ${species.name} vừa bị xóa khỏi hệ thống!`)

    return {
      message: "Xóa loài thành công và đã chuyển toàn bộ giống + thú cưng sang loài mới!",
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
  editSpecies,
  deleteSpecies,
};

module.exports = speciesService;