const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const adoptionFormService = require("../services/adoptionForm.service");

const getFormsByShelter = async (req, res, next) => {
  try {
    const { shelterId } = req.params;
    const selectedShelter = await db.Shelter.findOne({
      _id: shelterId,
      status: "active",
    });
    if (!selectedShelter) {
      return res
        .status(404)
        .json({ message: "Trung tâm không tồn tại hoặc không hoạt động" });
    }

    const forms = adoptionFormService.getFormsByShelter(shelterId);
    res.status(200).json(forms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createForm = async (req, res, next) => {
  const { shelterId, petId } = req.params;
  const { id } = req.payload;

  try {
    const selectedShelter = await db.Shelter.findOne({
      _id: shelterId,
      status: "active",
    });
    if (!selectedShelter) {
      return res
        .status(404)
        .json({ message: "Trung tâm không tồn tại hoặc không hoạt động" });
    }
    const pet = await db.Pet.findOne({
      _id: petId,
      status: "unavailable",
    });
    if (!pet) {
      return res.status(404).json({ message: "Không tìm thấy thú nuôi hoặc thú nuôi này không thể tạo form!" });
    }
    const existingForm = await db.AdoptionForm.findOne({
      pet: petId,
      shelter: shelterId,
    });
    if (existingForm) {
      return res.status(400).json({
        message: "Đã tồn tại form xin nhận nuôi cho thú nuôi này tại trung tâm!",
      });
    }

    const formData = req.body;
    const newForm = await adoptionFormService.createForm(
      shelterId,
      petId,
      formData,
      id
    );
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

async function editForm(req, res, next) {
    const { formId } = req.params;
    const formData = req.body;
    
    try {
        const updatedForm = await adoptionFormService.editForm(formId, formData);
        res.status(200).json(updatedForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteForm(req, res, next) {
  const { formId } = req.params;
  try {
    const form = await adoptionFormService.deleteForm(formId);
    res.status(204).json({ message: "Form deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const adoptionFormController = {
  getFormsByShelter,
    createForm,
    editForm,
    deleteForm
};

module.exports = adoptionFormController;
