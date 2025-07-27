const db = require("../models/");


const getAdtoptionRequestList = async (id) => {
  try {
    const adoptionRequest = await db.AdoptionSubmission.find({ performedBy: id })
      .populate("performedBy")
      .populate({
        path: "adoptionForm",
        populate: [
          { path: "pet", model: "Pet", select: "name petCode tokenMoney photos" },
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
          { path: "pet", model: "Pet", select: "name petCode" },
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

// update status submisison
const updateSubmissionStatus = async (submissionId, status) => {
  try {
    const allowedStatus = {
      pending: ["pending", "scheduling", "rejected"],
      scheduling: ["pending", "interviewing", "rejected", "scheduling"],
      interviewing: ["rejected", "reviewed", "interviewing"],
      reviewed: ["reviewed", "approved", "rejected"],
      approved: ["approved"],
      rejected: ["rejected"],
    };

    const submission = await db.AdoptionSubmission.findById(submissionId);
    if (!submission) {
      const error = new Error("Không tìm thấy hồ sơ nhận nuôi");
      error.statusCode = 404;
      throw error;
    }

    const currentStatus = submission.status;
    const allowedNextStatuses = allowedStatus[currentStatus];

    if (!allowedNextStatuses) {
      const error = new Error(`Trạng thái hiện tại "${currentStatus}" không hợp lệ`);
      error.statusCode = 400;
      throw error;
    }

    if (!allowedNextStatuses.includes(status)) {
      const error = new Error(
        `Trạng thái không hợp lệ. Chỉ cho phép: ${allowedNextStatuses.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    submission.status = status;
    await submission.save();
    return submission;

  } catch (error) {
    throw error;
  }
};

// schedule interview
const scheduleInterview = async ({
  submissionId,
  interviewId,
  availableFrom,
  availableTo,
  method,
  performedBy,
  reviewedBy
}) => {
  try {
    const submission = await db.AdoptionSubmission.findById(submissionId);
    if (!submission) {
      throw new Error("Không tìm thấy đơn nhận nuôi.");
    }
    if(submission.status !== "scheduling"){
      throw new Error("Chỉ có thể tạo lịch phỏng vấn với những đơn nhận nuôi trong trạng thái chờ phỏng vấn.");
    }
    if (!availableFrom || !availableTo || !method || !performedBy) {
  throw new Error("Thiếu thông tin bắt buộc để lên lịch phỏng vấn.");
  }
  if (new Date(availableFrom) >= new Date(availableTo)) {
  throw new Error("Thời gian bắt đầu phải trước thời gian kết thúc.");
}



    // Cập nhật trường interview
    submission.interview = {
      interviewId,
      availableFrom,
      availableTo,
      method,
      performedBy,
      reviewedBy,
      createAt: new Date(),
      updateAt: new Date(),
    };
    submission.status = "interviewing";
    await submission.save();
    return submission;
  } catch (err) {
    throw err;
  }
};




const adoptionSubmissionService = {
  getAdtoptionRequestList,
  createAdoptionSubmission,
  checkUserSubmittedForm,
  getAdoptionSubmissionById,
  getSubmissionsByPetIds,
  updateSubmissionStatus,
  scheduleInterview
};
module.exports = adoptionSubmissionService;