const Species = require("../models/species.model");

const getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find();
    console.log("📦 Species returned:", species); // << thêm dòng này

    res.status(200).json(species);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSpecies = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    // Kiểm tra trùng tên
    const existed = await Species.findOne({ name });
    if (existed)
      return res.status(409).json({ message: "Species already exists" });
    const species = new Species({ name });
    await species.save();
    res.status(201).json(species);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllSpecies, createSpecies };
