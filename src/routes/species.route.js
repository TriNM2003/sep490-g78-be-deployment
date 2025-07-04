const express = require("express");
const router = express.Router();
const {
  getAllSpecies,
  createSpecies,
} = require("../controllers/species.controller");

router.get("/getAll", getAllSpecies);
router.post("/create", createSpecies);

module.exports = router;
