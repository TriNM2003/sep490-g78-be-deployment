const medicalRecordService = require("../services/medicalRecord.service");
const { isStaffOfPetShelter } = require("../utils/permission.helper");

const createMedicalRecord = async (req, res) => {
  try {
    const userId = req.payload?._id || req.payload?.id;
    const { petId } = req.body;
    if (!petId) return res.status(400).json({ message: "Missing petId" });

    await isStaffOfPetShelter(userId, petId);

    const record = await medicalRecordService.createMedicalRecord({
      ...req.body,
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMedicalRecordsByPet = async (req, res) => {
  try {
    const petId = req.params.petId || req.query.petId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    if (!petId) return res.status(400).json({ message: "petId is required" });
    const { records, total } =
      await medicalRecordService.getMedicalRecordsByPet(petId, page, limit);
    res.status(200).json({ records, total, page, limit });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateMedicalRecord = async (req, res) => {
  try {
    const userId = req.payload?._id || req.payload?.id;
    const { petId } = req.body;
    if (!petId) return res.status(400).json({ message: "Missing petId" });

    await isStaffOfPetShelter(userId, petId);

    const record = await medicalRecordService.updateMedicalRecord(
      req.body.id, // hoặc req.body._id nếu FE gửi như vậy
      req.body
    );

    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMedicalRecord = async (req, res) => {
  try {
    const userId = req.payload?._id || req.payload?.id;
    const { id, petId } = req.body;
    if (!petId || !id)
      return res.status(400).json({ message: "Missing petId or record id" });

    await isStaffOfPetShelter(userId, petId);

    const record = await medicalRecordService.deleteMedicalRecord(id);

    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json({ message: "Medical record deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPetMedicalRecord = async (req, res) => {
  try {
    const { petId } = req.params; // Assuming the pet ID is in the request parameters
    const medicalRecord = await medicalRecordService.getPetMedicalRecord(petId);
    res.status(200).json(medicalRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getMedicalRecordById = async (req, res) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(
      req.params.id
    );
    if (!record)
      return res.status(404).json({ message: "Medical record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
