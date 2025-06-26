const db = require("../models/");


const getAdtoptionRequestList = async (userId) => {
    try {
        const adoptionRequest = await db.AdoptionSubmission.find({ performedBy: userId }).populate("performedBy").populate("adoptionForm").populate("answers.questionId");
        if (!adoptionRequest) {
            throw new Error("No adoption requests found for this user");
        }
        return adoptionRequest;
    } catch (error) {
        throw error;
    }
}

const adoptionSubmissionService = {
    getAdtoptionRequestList,
};
module.exports = adoptionSubmissionService;