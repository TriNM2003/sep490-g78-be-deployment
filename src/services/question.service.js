const db = require("../models");

const getAllQuestions = async () => {
  try {
    const questions = await db.Question.find();
    return questions;
  } catch (error) {
    throw error;
  }
};

const getQuestionById = async (questionId) => {
  try {
    const question = await db.Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    return question;
  } catch (error) {
    throw error;
  }
};

const createQuestion = async (data) => {
  try {
    const questionData = {
      title: data.title,
      priority: data.priority || "none",
      options: data.options.map((option) => ({
        title: option.title,
        isTrue: option.isTrue || false,
      })),
      status: "active",
      type: data.type,
    };
    const newQuestion = await db.Question.create(questionData);
    return newQuestion;
  } catch (error) {
    throw error;
  }
};

const editQuestion = async (questionId, data) => {
  try {
    const questionData = {
      title: data.title,
      priority: data.priority || "none",
      options: data.options.map((option) => ({
        title: option.title,
        isTrue: option.isTrue || false,
      })),
      status: data.status || "active",
      type: data.type,
    };
    const updatedQuestion = await db.Question.findByIdAndUpdate(
      questionId,
      questionData,
      { new: true }
    );
    if (!updatedQuestion) {
      throw new Error("Question not found");
    }
    if (updatedQuestion.status === "inactive") {
      throw new Error("Question is inactive and cannot be edited");
    }
    return updatedQuestion;
  } catch (error) {
    throw error;
  }
};

const deleteQuestion = async (questionId) => {
  try {
    const updatedQuestion = await db.Question.findByIdAndUpdate(
      questionId,
      { status: "inactive" },
      { new: true }
    );
    if (!updatedQuestion) {
      throw new Error("Question not found");
    }
    if (updatedQuestion.status === "inactive") {
      throw new Error("Question already deleted");
    }
    return updatedQuestion;
  } catch (error) {
    throw error;
  }
};

const questionService = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  editQuestion,
  deleteQuestion,
};

module.exports = questionService;
