const express = require ("express");
const petRouter = express.Router();
const bodyParser = require("body-parser");
const { petController } = require("../controllers");

petRouter.use(bodyParser.json());


petRouter.get("/get-by-shelter/:shelterId", petController.getPetListByShelter);
petRouter.get("/get-by-id/:petId", petController.getPetById);

module.exports = petRouter;