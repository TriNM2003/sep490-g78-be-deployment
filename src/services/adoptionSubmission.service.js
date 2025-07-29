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

const getSubmissionsByUserId = async (userId) => {
  try {
    const submissions = await db.AdoptionSubmission.find({ createdBy: userId })
      .populate("adoptionForm")
      .populate("adoptionForm.pet")
      .populate("adoptionForm.shelter");

    return submissions;
  } catch (error) {
    throw error;
  }
};

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

// get submission by petId
const getSubmissionsByPetIds = async (petIds) => {
  try {
    // Tìm tất cả AdoptionForm có status là active và thuộc các petId
    const adoptionForms = await db.AdoptionForm.find({
      pet: { $in: petIds },
      status: "active",
    }).select("_id");

    const formIds = adoptionForms.map((f) => f._id);

    if (!formIds.length) return [];

    const submissions = await db.AdoptionSubmission.find({
      adoptionForm: { $in: formIds },
    })
      .populate("performedBy", "fullName email address dob phoneNumber warningCount avatar")
      .populate({
        path: "adoptionForm",
        populate: [
          { path: "pet", model: "Pet", select: "name petCode photos" },
          { path: "shelter", model: "Shelter", select: "name" },
        ],
      })
      .populate("answers.questionId")
      .sort({ createdAt: -1 });

    return submissions;
  } catch (error) {
    throw error;
  }
};



const adoptionSubmissionService = {
    getAdtoptionRequestList,
    getSubmissionsByUserId,
    createAdoptionSubmission,
    checkUserSubmittedForm,
    getAdoptionSubmissionById,
    getSubmissionsByPetIds
};
module.exports = adoptionSubmissionService;