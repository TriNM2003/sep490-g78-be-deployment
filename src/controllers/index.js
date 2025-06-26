const authController = require("./auth.controller");
const userController = require("./user.controller");
const petController = require("./pet.controller");
const adoptionSubmissionController = require("./adoptionSubmission.controller");
const medicalRecordController = require("./medicalRecord.controller");

module.exports = {
  authController,
  userController,
  petController,
  adoptionSubmissionController,
  medicalRecordController
};
