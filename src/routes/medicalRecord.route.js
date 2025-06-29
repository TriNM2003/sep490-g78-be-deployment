const express = require("express");
const medicalRecordRouter = express.Router();
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const medicalRecordController = require("../controllers/medicalRecord.controller");
medicalRecordRouter.get("/get-by-pet",
  verifyAccessToken,
  medicalRecordController.getMedicalRecordsByPet
);
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
medicalRecordRouter.get("/get-medical-record/:petId", medicalRecordController.getPetMedicalRecord);


module.exports = medicalRecordRouter;

