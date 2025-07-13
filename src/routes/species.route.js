const express = require("express");
const router = express.Router();
const {
  getAllSpecies,
  createSpecies,
} = require("../controllers/species.controller");
const Species = require("../models/species.model");
const speciesController = require("../controllers/species.controller");


router.get("/getAll", getAllSpecies);
router.get("/get-all", speciesController.getAll);
router.post("/create", createSpecies);

module.exports = router;
