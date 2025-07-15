const express = require("express");
const router = express.Router();
const { getAllBreeds } = require("../controllers/breed.controller");

router.get("/getAll", getAllBreeds);

module.exports = router;
