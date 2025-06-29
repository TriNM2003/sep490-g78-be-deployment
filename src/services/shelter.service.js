const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function getAll() {
  try {
    const shelters = await db.Shelter.find({status:"active"}).populate(
      "members._id"
    )
    .lean();
    return shelters.map((s) => {
      return {
        ...s,
        members: s.members.map((m) => ({
          _id: String(m._id._id),
          fullName: m._id.fullName,
          avatar: m._id.avatar,
          roles: m.roles,
        })),
      };
    });
  } catch (error) {
    throw error;
  }
}

const shelterService = {
  getAll,
};

module.exports = shelterService;
