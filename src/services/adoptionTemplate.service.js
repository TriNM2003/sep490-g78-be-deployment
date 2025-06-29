const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function getAll(shelterId) {
  try {
    const templates = await db.AdoptionTemplate.find({shelter:shelterId})
      .populate("species", "name") 
      .populate("createdBy", "fullName email avatar") 
      .populate("shelter", "name")
      .lean();
      return templates?.map((t)=>{
        return {
          ...t, 
          species:t?.species?.name,
          shelter:t?.shelter?.name,
        }
      });
  } catch (error) {
    throw error;
  }
}

const adoptionTemplateService = {
  getAll,
};

module.exports = adoptionTemplateService;
