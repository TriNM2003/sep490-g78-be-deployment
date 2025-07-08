const express = require("express");
const medicalRecordRouter = express.Router({ mergeParams: true });
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const medicalRecordController = require("../controllers/medicalRecord.controller");

// Route lấy danh sách medical records theo petId (có phân trang)
medicalRecordRouter.get("/", medicalRecordController.getMedicalRecordsByPet);

medicalRecordRouter.post(
  "/",
  verifyAccessToken,
  medicalRecordController.createMedicalRecord
);
medicalRecordRouter.put(
  "/:id",
  verifyAccessToken,
  medicalRecordController.updateMedicalRecord
);
medicalRecordRouter.delete("/:id", medicalRecordController.deleteMedicalRecord);
medicalRecordRouter.get(
  "/:id",
  verifyAccessToken,
  medicalRecordController.getMedicalRecordById
);
medicalRecordRouter.get(
  "/get-medical-record/:petId",
  medicalRecordController.getPetMedicalRecord
);

module.exports = medicalRecordRouter;
