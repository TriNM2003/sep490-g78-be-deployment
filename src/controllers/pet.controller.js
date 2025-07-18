const petService = require("../services/pet.service");
const { cloudinary } = require("../configs/cloudinary");
const medicalRecordService = require("../services/medicalRecord.service");
const { analyzePetWithGPT } = require("../services/gptVision.service");
const mongoose = require("mongoose");
const db = require("../models");

const getAllPets = async (req, res) => {
  try {
    const { shelterId } = req.params;
    const { status } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 8;

    if (!shelterId) {
      return res.status(400).json({ message: "Missing shelterId" });
    }

    const result = await petService.getAllPetsByShelter(shelterId, page, limit, status);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const viewDetailPet = async (req, res) => {
  try {
    const pet = await petService.viewPetDetails(req.params.petId);
    res.status(200).json(pet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const createPet = async (req, res) => {
  try {
    const { shelterId } = req.params;

    if (!shelterId) {
      return res.status(400).json({ message: "Missing shelterId" });
    }

    const petData = { ...req.body, shelter: shelterId };

    const newPet = await petService.createPet(petData);

    res.status(201).json(newPet);
  } catch (error) {
    console.error("CREATE PET ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

const updatePet = async (req, res) => {
  try {
    const { petId, shelterId } = req.params;

    console.log("🛠 Params:", { petId, shelterId });
    console.log("🛠 Body:", req.body);

    const existingPet = await db.Pet.findOne({
      _id: new mongoose.Types.ObjectId(petId),
      shelter: new mongoose.Types.ObjectId(shelterId),
    });

    if (!existingPet) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thú cưng thuộc trạm cứu hộ!" });
    }

    const updatedPet = await db.Pet.findByIdAndUpdate(petId, req.body, {
      new: true,
    });

    res.status(200).json(updatedPet);
  } catch (error) {
    console.error("❌ Lỗi updatePet:", error);
    res.status(400).json({ message: error.message });
  }
};
``;

const deletePet = async (req, res) => {
  try {
    const { petId, shelterId } = req.params;

    const pet = await db.Pet.findOne({ _id: petId, shelter: shelterId });
    if (!pet) {
      return res.status(404).json({ message: "Không tìm thấy thú cưng!" });
    }

    await db.Pet.findByIdAndDelete(petId);

    res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    console.error("Lỗi deletePet:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMedicalRecords = async (req, res) => {
  try {
    const records = await petService.getMedicalRecords(req.params.petId);
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "pets",
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPetList = async (req, res) => {
  try {
    const pets = await petService.getPetList();
    return res.status(200).json(pets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getPetById = async (req, res) => {
  const { petId } = req.params;
  try {
    const pet = await petService.getPetById(petId);
    return res.status(200).json(pet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAdoptedPetbyUser = async (req, res) => {
  //   const userId = req.payload.id; // Assuming user ID is in the payload
  const userId = req.params.userId; // Assuming user ID is passed as a URL parameter
  try {
    const pets = await petService.getAdoptedPetbyUser(userId);
    return res.status(200).json(pets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
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

const analyzePetImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64)
      return res.status(400).json({ message: "Missing image data" });

    const result = await analyzePetWithGPT(imageBase64);
    res.status(200).json(result);
    console.log("GPT ANALYZE RESULT:", result);
  } catch (err) {
    console.error("GPT ANALYZE ERROR:", err);
    res
      .status(500)
      .json({ message: "AI phân tích thất bại", error: err.message });
  }
};

const petController = {
  getAllPets,
  createPet,
  updatePet,
  deletePet,
  getMedicalRecords,
  viewDetailPet,
  uploadImage,
  analyzePetImage,
  getPetList,
  getPetById,
  getAdoptedPetbyUser,
  getMedicalRecordsByPet,
};

module.exports = petController;
