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

async function changeFormStatus(formId, formData) {
  try {
    const form = await db.AdoptionForm.findById(formId)
      .populate("pet", "_id name petCode")
      .populate("questions")
      .populate("createdBy", "fullName email avatar")
      .lean();
    if (!form) {
      throw new Error("Không tìm thấy form");
    }

    const updateForm = await db.AdoptionForm.findOneAndUpdate(
      { _id: formId },
      { status: formData.status },
      { new: true }
    )
      .populate("pet", "_id name petCode")
      .populate("questions")
      .populate("createdBy", "fullName email avatar")
      .lean();

    if (!updateForm) {
      throw new Error("Lỗi không tìm thấy form đã cập nhật");
    }
    if (formData.status == "draft" && form.status == "active") {
      const pet = await db.Pet.findById(form.pet._id);
      if (!pet) {
        throw new Error("Không tìm thấy thú cưng liên kết với form này");
      }
      const updatePet = await db.Pet.findByIdAndUpdate(
        form.pet._id,
        { status: "unavailable" },
        { new: true }
      );
      if (!updatePet) {
        throw new Error("Lỗi cập nhật trạng thái thú cưng");
      }
    } else if (formData.status == "active" && form.status == "draft") {
      const pet = await db.Pet.findById(form.pet);
      if (!pet) {
        throw new Error("Không tìm thấy thú cưng liên kết với form này");
      }
      const updatePet = await db.Pet.findByIdAndUpdate(
        form.pet._id,
        { status: "available" },
        { new: true }
      );
      if (!updatePet) {
        throw new Error("Lỗi cập nhật trạng thái thú cưng");
      }
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
    if (formExists.status == "draft") {
      await db.AdoptionForm.findByIdAndDelete(formId);
    } else {
      throw new Error("Không thể xóa form!");
    }
    return "Xóa form thành công!";
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
  changeFormStatus,
  deleteForm,
  getFormsByPetId,
};

module.exports = adoptionFormService;
