const express = require ("express");
const petRouter = express.Router();
const bodyParser = require("body-parser");
const { petController } = require("../controllers");

petRouter.use(bodyParser.json());


petRouter.get("/get-pet-list", petController.getPetList);
petRouter.get("/get-by-id/:petId", petController.getPetById);
petRouter.get("/get-adopted-by-user/:userId", petController.getAdoptedPetbyUser);

module.exports = petRouter;