const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const shelterService = require("../services/shelter.service");

async function getAll(req, res,next) {
    try {
        const shelters = await shelterService.getAll();
        res.status(200).json(shelters);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

const shelterController = {
    getAll
};

module.exports = shelterController;
