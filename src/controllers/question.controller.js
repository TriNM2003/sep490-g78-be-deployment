const questionService = require("../services/question.service");

const getAllQuestions = async (req, res) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestionById = async (req, res) => {
  const {questionId} = req.params;
  try {
    const question = await questionService.getQuestionById(questionId);
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const questionData = req.body;
    const newQuestion = await questionService.createQuestion(questionData);
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const {questionId} = req.params;
  try {
    const result = await questionService.deleteQuestion(questionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const questionController = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  editQuestion,
  deleteQuestion,
};

module.exports = questionController;
