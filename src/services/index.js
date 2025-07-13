const shelterService = require("./shelter.service");
const userService = require('./user.service');
const petService = require("./pet.service");
const adoptionSubmissionService = require("./adoptionSubmission.service");
const medicalRecordService = require("./medicalRecord.service");
const speciesService = require("./species.service");
const questionService = require("./question.service");
const blogService = require("./blog.service");
const reportService = require("./report.service");
const authService = require("./auth.service")
const adoptionTemplateService = require("./adoptionTemplate.service");
const adoptionFormService = require("./adoptionForm.service")

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
    questionService,
    blogService,
    reportService,
}
