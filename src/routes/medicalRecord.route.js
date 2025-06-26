const express = require ("express");
const medicalRecordRouter = express.Router();
const bodyParser = require("body-parser");

const { medicalRecordController } = require("../controllers");

medicalRecordRouter.use(bodyParser.json());

medicalRecordRouter.get("/get-medical-record/:petId", medicalRecordController.getPetMedicalRecord);



module.exports = medicalRecordRouter;