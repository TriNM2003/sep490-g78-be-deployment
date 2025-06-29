const MedicalRecord = require("../models/medicalRecord.model");
const db = require("../models/");


const createMedicalRecord = async (data) => {
  const record = new MedicalRecord(data);
  return await record.save();
};

const updateMedicalRecord = async (id, data) => {
  return await MedicalRecord.findByIdAndUpdate(id, data, { new: true });
};
const getMedicalRecordsByPet = async (petId) => {
  return await MedicalRecord.find({ pet: petId }).populate(
    "performedBy",
    "fullName email"
  );
};
const deleteMedicalRecord = async (id) => {
  return await MedicalRecord.findByIdAndDelete(id);
};

const getMedicalRecordById = async (id) => {
  return await MedicalRecord.findById(id)
    .populate("pet")
    .populate("performedBy", "fullName email");
};
const getPetMedicalRecord = async (petId) => {
    try {
        const pet = await db.MedicalRecord.find({pet: petId}).populate("pet").populate("performedBy");
        if (!pet) {
            throw new Error("Pet not found");
        }
        return pet;
    } catch (error) {
        throw error;
    }
}

module.exports = {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordById,
  getMedicalRecordsByPet,
  getPetMedicalRecord,
  
};
