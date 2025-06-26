const userRouter = require("./user.route");
const authRouter = require("./auth.route");
const petRouter = require("./pet.route");
const adoptionSubmissionRouter = require("./adoptionSubmission.route");
const medicalRecordRouter = require("./medicalRecord.route");

module.exports = {
    petRouter,
    userRouter,
    authRouter,
    adoptionSubmissionRouter,
    medicalRecordRouter
}


