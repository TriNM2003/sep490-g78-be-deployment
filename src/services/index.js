const authService = require("./auth.service");
const userService = require('./userService');
const petService = require("./pet.service");
const adoptionSubmissionService = require("./adoptionSubmission.service");
const medicalRecordService = require("./medicalRecord.service");
module.exports = {
    authService,
    userService,
    petService,
    adoptionSubmissionService,
    medicalRecordService
}