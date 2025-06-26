const express = require("express");
const questionRouter = express.Router();
const bodyParser = require("body-parser");
const { questionController } = require("../controllers");

questionRouter.use(bodyParser.json());

questionRouter.get("/", questionController.getAllQuestions);
questionRouter.get("/get-by-id/:questionId", questionController.getQuestionById);
questionRouter.post("/create", questionController.createQuestion);
questionRouter.put("/update/:questionId", questionController.editQuestion);
questionRouter.delete("/delete/:questionId", questionController.deleteQuestion);

module.exports = questionRouter;