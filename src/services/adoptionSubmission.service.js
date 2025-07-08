const db = require("../models/");


const getAdtoptionRequestList = async (id) => {
    try {
        const adoptionRequest = await db.AdoptionSubmission.find({ performedBy: id })
        .populate("performedBy")
         .populate({
        path: "adoptionForm",
        populate: [
          { path: "pet", model: "Pet" , select:"name petCode tokenMoney photos"},
          { path: "shelter", model: "Shelter", select: "name" },
        ]
      })
        .populate("answers.questionId");
        if (!adoptionRequest) {
            throw new Error("No adoption requests found for this user");
        }
        return adoptionRequest;
    } catch (error) {
        throw error;
    }
}

// submit adoption request for user
const createAdoptionSubmission = async (data) => {
    return await db.AdoptionSubmission.create(data);
};

// check user submission exist
const checkUserSubmittedForm = async (userId, adoptionFormId) => {
    const existingSubmission = await db.AdoptionSubmission.findOne({
        performedBy: userId,
        adoptionForm: adoptionFormId,
    });

    return existingSubmission; // true nếu đã submit, false nếu chưa
};

// get adoption form submission by id
const getAdoptionSubmissionById = async (id) => {
  try {
    const adoptionSubmission = await db.AdoptionSubmission.findById(id)
      .populate("performedBy")
       .populate({
        path: "adoptionForm",
        populate: [
          { path: "pet", model: "Pet" , select:"name petCode"},
          { path: "shelter", model: "Shelter", select: "name" },
        ]
      })
      .populate("answers.questionId");

    if (!adoptionSubmission) {
      throw new Error("Không tìm thấy submission");
    }

    return adoptionSubmission;
  } catch (error) {
    throw error;
  }
};

const adoptionSubmissionService = {
    getAdtoptionRequestList,
    createAdoptionSubmission,
    checkUserSubmittedForm,
    getAdoptionSubmissionById
};
module.exports = adoptionSubmissionService;