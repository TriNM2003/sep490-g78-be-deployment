const shelterService = require("./shelter.service");
const userService = require('./userService');
const petService = require("./pet.service");
const adoptionSubmissionService = require("./adoptionSubmission.service");
const medicalRecordService = require("./medicalRecord.service");
const speciesService = require("./spieces.service");
module.exports = {
    authService,
    userService,
    petService,
    adoptionSubmissionService,
    medicalRecordService,
    shelterService,
    adoptionTemplateService,
    adoptionFormService,
    speciesService,
}
