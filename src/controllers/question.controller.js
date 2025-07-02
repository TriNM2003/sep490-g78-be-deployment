const questionService = require("../services/question.service");

const getAllQuestions = async (req, res) => {
  try {
   const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await questionService.getAllQuestions(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  const {questionId} = req.params;
  try {
    const question = await questionService.getQuestionById(questionId);
    res.status(200).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    const newQuestion = await questionService.createQuestion(questionData);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editQuestion = async (req, res) => {
  const {questionId} = req.params;
  const questionData = req.body;
  try {
    const updatedQuestion = await questionService.editQuestion(
      questionId,
      questionData
    );
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editListQuestions = async (req, res) => {
  try {
    const questions = req.body; 

    if (!Array.isArray(questions)) {
      return res.status(400).json({ message: "Invalid request body. Expected an array." });
    }

    const result = await questionService.editListQuestions(questions);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const duplicateQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    const duplicatedQuestion = await questionService.duplicateQuestion(questionId);
    res.status(201).json(duplicatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const duplicateListQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ message: "questionIds must be a non-empty array." });
    }

    const result = await questionService.duplicateListQuestions(questionIds);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const {questionId} = req.params;
  try {
    const result = await questionService.deleteQuestion(questionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listQuestionsByAdoptionForm = async (req, res) => {
  const { adoptionFormId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const result = await questionService.listQuestionsByAdoptionForm(adoptionFormId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listQuestionsByAdoptionTemplate = async (req, res) => {
  const { adoptionTemplateId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const result = await questionService.listQuestionsByAdoptionTemplate(adoptionTemplateId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}



const questionController = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  editQuestion,
  deleteQuestion,
  listQuestionsByAdoptionForm,
  listQuestionsByAdoptionTemplate,
  editListQuestions,
  duplicateQuestion,
  duplicateListQuestions
};

module.exports = questionController;
