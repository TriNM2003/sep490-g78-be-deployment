const shelterService = require("./shelter.service");
const userService = require('./userService');
const petService = require("./pet.service");
const adoptionSubmissionService = require("./adoptionSubmission.service");
const medicalRecordService = require("./medicalRecord.service");
const postService = require("./post.service");
const authService = require("./auth.service");
const adoptionTemplateService = require("./adoptionTemplate.service");
const adoptionFormService = require("./adoptionForm.service");
const donationService = require("./donation.service");
const blogService = require("./blog.service");
module.exports = {
    authService,
    userService,
    petService,
    adoptionSubmissionService,
    medicalRecordService,
    shelterService,
    adoptionTemplateService,
    adoptionFormService,
    postService,
    donationService,
    blogService,
}
