const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");

async function getFormsByShelter(shelterId) {
  try {
    const forms = await db.AdoptionForm.find({ shelter: shelterId })
      .populate("pet", "_id name petCode")
      .populate("questions")
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
      questions: formData.questions || [],
      createdBy,
    });

    const savedForm = await newForm.save();
    const populatedForm = await db.AdoptionForm.findById(savedForm._id)
      .populate("pet", "_id name petCode")
      .populate("questions")
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

    const updateForm = await db.AdoptionForm.findOneAndUpdate(
      { _id: formId },
      formData,
      { new: true }
    )
      .populate("pet", "_id name petCode")
      .populate("questions")
      .populate("createdBy", "fullName email avatar")
      .lean();
    
    if (!updateForm) {
      throw new Error("Lỗi không tìm thấy form đã cập nhật");
    }
    
    return {
      ...updateForm,
      shelter: updateForm?.shelter?.name,
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


// get form by petId
async function getFormsByPetId(petId) {
  try {
    const form = await db.AdoptionForm.findOne({ pet: petId, status: "active" })
      .populate("pet")
      .populate("createdBy", "fullName email avatar")
      .populate("shelter", "name")
      .populate("questions")
      .lean();
  
      return {
        ...form,
        shelter: form?.shelter?.name,
      
      };
  } catch (error) {
    throw error;
  }
}

const adoptionFormService = {
  getFormsByShelter,
  createForm,
  editForm,
  deleteForm,
  getFormsByPetId

};

module.exports = adoptionFormService;
