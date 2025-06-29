const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const adoptionTemplateService = require("../services/adoptionTemplate.service");


async function getAll(req, res,next) {
    const {shelterId} = req.params;
    try{
        const templates = await adoptionTemplateService.getAll(shelterId);
        res.status(200).json(templates);
        
    }catch(error){
        res.status(400).json({ message: error.message });
    }
}

const adoptionTemplateController = {
    getAll
};

module.exports = adoptionTemplateController;
