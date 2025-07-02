const express = require("express");
const questionRouter = express.Router();
const bodyParser = require("body-parser");
const { questionController } = require("../controllers");

questionRouter.use(bodyParser.json());

questionRouter.get("/getAll", questionController.getAllQuestions);
questionRouter.get("/get-by-id/:questionId", questionController.getQuestionById);
questionRouter.post("/create", questionController.createQuestion);
questionRouter.put("/update/:questionId", questionController.editQuestion);
questionRouter.put("/edit-list-questions", questionController.editListQuestions);
questionRouter.post("/duplicate/:questionId", questionController.duplicateQuestion);
questionRouter.post("/duplicate-list-questions",questionController.duplicateListQuestions
);
questionRouter.delete("/delete/:questionId", questionController.deleteQuestion);
questionRouter.get(
  "/get-by-adoption-form/:adoptionFormId",
  questionController.listQuestionsByAdoptionForm
);
questionRouter.get(
  "/get-by-adoption-template/:adoptionTemplateId",
  questionController.listQuestionsByAdoptionTemplate
);


module.exports = questionRouter;