const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function getFormsByShelter(shelterId) {
  try {
    const forms = await db.AdoptionForm.find({ shelter: shelterId })
      .populate("pet", "_id name petCode")
      .populate("createdBy", "fullName email avatar")
      .populate("shelter", "name")
      .lean();
    return forms?.map((form) => {
      return {
        ...form,
        shelter: form?.shelter?.name,
      };
    });
  } catch (error) {
    throw error;
  }
}

async function createForm(shelterId, petId, formData, createdBy) {
  try {
    const shelter = await db.Shelter.findOne({
      _id: shelterId,
      status: "active",
    });
    if (!shelter) {
      throw new Error("Không tìm thấy trung tâm");
    }

    const pet = await db.Pet.findOne({ _id: petId, status: "unavailable" });
    if (!pet) {
      throw new Error("Pet not found");
    }

    const newForm = new db.AdoptionForm({
      shelter: shelterId,
      pet: petId,
      title: formData.title,
      description: formData.description,
      createdBy,
    });

    const savedForm = await newForm.save();
    const populatedForm = await db.AdoptionForm.findById(savedForm._id)
      .populate("pet", "_id name petCode")
      .populate("createdBy", "fullName email avatar")
      .populate("shelter", "name")
      .lean();
    if (!populatedForm) {
      throw new Error("Lỗi không tìm thấy form đã tạo");
    }
    return {
      ...populatedForm,
      shelter: populatedForm?.shelter?.name,
    };
  } catch (error) {
    throw error;
  }
}

async function editForm(formId, formData) {
  try {
    const form = await db.AdoptionForm.findById(formId);
    if (!form) {
      throw new Error("Không tìm thấy form");
    }

    form.title = formData.title || form.title;
    form.description = formData.description || form.description;

    const updatedForm = await form.save();
    const populatedForm = await db.AdoptionForm.findById(updatedForm._id)
      .populate("pet", "_id name petCode")
      .populate("createdBy", "fullName email avatar")
      .populate("shelter", "name")
      .lean();
    
    if (!populatedForm) {
      throw new Error("Lỗi không tìm thấy form đã cập nhật");
    }
    
    return {
      ...populatedForm,
      shelter: populatedForm?.shelter?.name,
    };
  } catch (error) {
    throw error;
  }

}

async function deleteForm(formId) {
    try {
        const formExists = await db.AdoptionForm.findById(formId);
        if (!formExists) {
            throw new Error("Không tìm thấy form!");
        }
        if (formExists.status == "active") {
            throw new Error("Không thể xóa form!");
        }
        const form = await db.AdoptionForm.findByIdAndDelete(formId);
        return form;
    } catch (error) {
        throw error;
    }
}

const adoptionFormService = {
  getFormsByShelter,
  createForm,
  editForm,
  deleteForm
};

module.exports = adoptionFormService;
