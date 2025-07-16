const db = require("../models");

const isStaffOfPetShelter = async (userId, petId) => {
  const pet = await db.Pet.findById(petId);
  if (!pet) throw new Error("Pet not found");

  const shelter = await db.Shelter.findOne({
    _id: pet.shelter,
    members: {
      $elemMatch: {
        _id: userId,
        roles: "staff",
      },
    },
  });

  if (!shelter)
    throw new Error("Bạn không có quyền staff tại trạm cứu hộ này!");

  return { pet, shelter };
};
module.exports = { isStaffOfPetShelter };
