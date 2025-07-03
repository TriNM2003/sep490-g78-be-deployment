const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const petRouter = require("./pet.route");
const adoptionSubmissionRouter = require("./adoptionSubmission.route");
const medicalRecordRouter = require("./medicalRecord.route");
const shelterRouter = require("./shelter.route");
const adoptionTemplateRouter = require("./adoptionTemplate.route");
const postRouter = require("./post.route");

module.exports = {
    petRouter,
    userRouter,
    authRouter,
    adoptionSubmissionRouter,
    medicalRecordRouter,
    shelterRouter,
    adoptionTemplateRouter,
    postRouter
}
