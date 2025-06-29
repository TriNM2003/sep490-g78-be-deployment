const express = require("express");
const medicalRecordRouter = express.Router();
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const medicalRecordController = require("../controllers/medicalRecord.controller");
router.get(
  "/",
  verifyAccessToken,
  medicalRecordController.getMedicalRecordsByPet
);
router.post(
  "/",
  verifyAccessToken,
  medicalRecordController.createMedicalRecord
);
router.put(
  "/:id",
  verifyAccessToken,
  medicalRecordController.updateMedicalRecord
);
router.delete("/:id", medicalRecordController.deleteMedicalRecord);
router.get(
  "/:id",
  verifyAccessToken,
  medicalRecordController.getMedicalRecordById
);
medicalRecordRouter.get("/get-medical-record/:petId", medicalRecordController.getPetMedicalRecord);


module.exports = medicalRecordRouter;

