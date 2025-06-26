const medicalRecordService = require('../services/medicalRecord.service');

const getPetMedicalRecord = async (req, res) => {
    try {
        const { petId } = req.params; // Assuming the pet ID is in the request parameters
        const medicalRecord = await medicalRecordService.getPetMedicalRecord(petId);
        res.status(200).json(medicalRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const medicalRecordController = {
    getPetMedicalRecord,
};
module.exports = medicalRecordController;