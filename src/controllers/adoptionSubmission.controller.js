const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const adoptionSubmissionService = require("../services/adoptionSubmission.service");
const AdoptionSubmission = require("../models/adoptionSubmission.model");
const { mailer } = require("../configs");


const getAdtoptionRequestList = async (req, res) => {
    try {
        const adoptionRequests = await adoptionSubmissionService.getAdtoptionRequestList(req.payload.id);
        res.status(200).json(adoptionRequests);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// submit adoption request for user
const createAdoptionSubmission = async (req, res) => {
  try {
    const { adoptionFormId, answers } = req.body;
    const userId = req.payload.id;

    // Tính thời gian 1 tháng trước
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Đếm số pet đã được user này nhận nuôi trong 1 tháng
    const adoptionsLastMonth = await db.Pet.countDocuments({
      adopter: userId,
      status: "adopted",
      updatedAt: { $gte: oneMonthAgo },
    });

    // Lấy tất cả questionId từ answers
    const questionIds = answers.map((a) => a.questionId);
    const questions = await db.Question.find({ _id: { $in: questionIds } });

    const questionMap = new Map();
    for (const q of questions) {
      questionMap.set(q._id.toString(), q);
    }

    let totalScore = 0;
    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());
      if (!question) continue;

      const correctOptions = question.options.filter((opt) => opt.isTrue);
      const totalCorrect = correctOptions.length;
      if (totalCorrect === 0) continue;

      const userCorrect = (answer.selections || []).filter((sel) =>
        correctOptions.some((opt) => opt.title === sel)
      ).length;

      const multiplier = {
        none: 0,
        low: 1,
        medium: 2,
        high: 3,
      }[question.priority] || 0;

      totalScore += (userCorrect / totalCorrect) * multiplier;
    }

    // Kiểm tra đã nộp đơn chưa
    const existing = await db.AdoptionSubmission.findOne({
      performedBy: userId,
      adoptionForm: adoptionFormId,
    });

    if (existing) {
      return res.status(400).json({ message: "Bạn đã nộp đơn cho thú cưng này rồi." });
    }

    // Tạo đơn
    const submission = new db.AdoptionSubmission({
      performedBy: userId,
      adoptionForm: adoptionFormId,
      answers,
      adoptionsLastMonth,
      total: totalScore,
    });

    const saved = await submission.save();

    // Lấy thông tin người dùng
      // Gửi email xác nhận
    const user = await db.User.findById(userId);
    const form = await db.AdoptionForm.findById(adoptionFormId).populate({
      path: "pet",
      populate: { path: "shelter", select: "name" },
    });

    if (user && user.email && form && form.pet) {
      const to = user.email;
      const petName = form.pet.name || "thú cưng";
      const shelterName = form.pet.shelter?.name || "Trung tâm cứu hộ";

      const subject = "Xác nhận đăng ký nhận nuôi";

      const body = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2>Cảm ơn bạn đã gửi đơn nhận nuôi!</h2>
          <p>Xin chào <strong>${user.name || "bạn"}</strong>,</p>
          <p>Chúng tôi rất cảm kích vì bạn đã gửi đơn nhận nuôi cho thú cưng <strong>${petName}</strong> từ trung tâm <strong>${shelterName}</strong>.</p>
          <p>Đơn của bạn đã được tiếp nhận và đang chờ xét duyệt. Chúng tôi sẽ xem xét và phản hồi bạn trong thời gian sớm nhất.</p>
          <p style="margin-top: 20px;">Trân trọng,<br>${shelterName}</p>
        </div>
      `;

      await mailer.sendEmail(to, subject, body);
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error("Lỗi khi tạo đơn nhận nuôi:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// check user submitted form
const checkUserSubmitted = async (req, res) => {
  try {
    const userId = req.payload.id;
    const { adoptionFormId } = req.body;

    if (!adoptionFormId) {
      return res.status(404).json({ message: "Thiếu adoptionFormId" });
    }

    const submission = await adoptionSubmissionService.checkUserSubmittedForm(
      userId,
      adoptionFormId
    );

     if (submission) {
      return res.status(200).json({
        submitted: true,
        submissionId: submission._id,
      });
    }

    return res.status(200).json({ submitted: false });
    

    return res.status(200).json({ submitted });
  } catch (error) {
    console.error("Lỗi khi kiểm tra submission:", error);
    return res.status(400).json({ message: "Đã tồn tại đơn xin nhận nuôi!" });
  }
};

// get adoption form submission by id
const getAdoptionSubmissionById = async (req, res) => {
  try {
    const id = req.params.submissionId;
    const submission = await adoptionSubmissionService.getAdoptionSubmissionById(id);
    res.status(200).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get submission by petID
const getSubmissionsByPetIds = async (req, res) => {
  try {
    const { petIds } = req.body;

    if (!Array.isArray(petIds) || petIds.length === 0) {
      return res.status(400).json({ message: "Thiếu danh sách petIds" });
    }

    const result = await adoptionSubmissionService.getSubmissionsByPetIds(petIds);
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi lấy submissions:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};



const adoptionSubmissionController = {
    getAdtoptionRequestList,
    createAdoptionSubmission,
    checkUserSubmitted,
    getAdoptionSubmissionById,
    getSubmissionsByPetIds
};

module.exports = adoptionSubmissionController;