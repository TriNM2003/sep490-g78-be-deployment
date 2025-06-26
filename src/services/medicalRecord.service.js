const db = require("../models/");

const getPetMedicalRecord = async (petId) => {
    try {
        const pet = await db.MedicalRecord.findOne({pet: petId}).populate("pet").populate("performedBy");
        if (!pet) {
            throw new Error("Pet not found");
        }
        return pet;
    } catch (error) {
        throw error;
    }
}

const medicalRecordService = {
    getPetMedicalRecord,
}

module.exports = medicalRecordService;