const authController = require("./auth.controller");
const userController = require("./user.controller");
const petController = require("./pet.controller");
const adoptionSubmissionController = require("./adoptionSubmission.controller");
const medicalRecordController = require("./medicalRecord.controller");
const shelterController = require("./shelter.controller");
const adoptionTemplateController = require("./adoptionTemplate.controller");
const adoptionFormController = require("./adoptionForm.controller");
const speciesController = require("./species.controller");

const postController = require("./post.controller");
const donationController = require("./donation.controller");
const blogController = require("./blog.controller");

const breedController = require("./breed.controller");

const reportController = require("./report.controller");



module.exports = {
  authController,
  userController,
  petController,
  adoptionSubmissionController,
  medicalRecordController,
  shelterController,
  adoptionTemplateController,
  adoptionFormController,
  speciesController,

  postController,
  donationController,
  breedController,
  blogController,
  reportController,

};
