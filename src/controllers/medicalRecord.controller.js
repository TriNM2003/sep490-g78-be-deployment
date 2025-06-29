const medicalRecordService = require("../services/medicalRecord.service");

const createMedicalRecord = async (req, res) => {
  try {
    const userId = req.payload?._id || req.payload?.id;
    console.log("userId in createMedicalRecord:", userId);
    const record = await medicalRecordService.createMedicalRecord({
      ...req.body,
      performedBy: userId,
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
    s;
  }
};
const getMedicalRecordsByPet = async (req, res) => {
  try {
    const { petId } = req.query;
    if (!petId) return res.status(400).json({ message: "petId is required" });
    const records = await medicalRecordService.getMedicalRecordsByPet(petId);
    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateMedicalRecord = async (req, res) => {
  try {
    const record = await medicalRecordService.updateMedicalRecord(
      req.params.id,
      req.body
    );
    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const record = await medicalRecordService.deleteMedicalRecord(
      req.params.id
    );
    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPetMedicalRecord = async (req, res) => {
    try {
        const { petId } = req.params; // Assuming the pet ID is in the request parameters
        const medicalRecord = await medicalRecordService.getPetMedicalRecord(petId);
        res.status(200).json(medicalRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getMedicalRecordById = async (req, res) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(
      req.params.id
    );
    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordById,
  getMedicalRecordsByPet,
  getPetMedicalRecord,
};

