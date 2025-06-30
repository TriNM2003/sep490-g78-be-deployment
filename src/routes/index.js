const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const petRouter = require("./pet.route");
const adoptionSubmissionRouter = require("./adoptionSubmission.route");
const medicalRecordRouter = require("./medicalRecord.route");
const shelterRouter = require("./shelter.route");
const adoptionTemplateRouter = require("./adoptionTemplate.route");
const speciesRouter = require("./species.route");
const breedRouter = require("./breed.route");

module.exports = {
  petRouter,
  userRouter,
  authRouter,
  adoptionSubmissionRouter,
  medicalRecordRouter,
  shelterRouter,
  adoptionTemplateRouter,
  speciesRouter,
  breedRouter,
};
