const db = require("../models");

const getByShelter = async (shelterId) => {
  try {
    const consentForms = await db.ConsentForm.find({ shelter: shelterId })
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    return consentForms;
  } catch (error) {
    // console.error('Error fetching consent forms by shelter:', error);
    throw new Error(error);
  }
};

const getByUser = async (userId) => {
  try {
    const consentForms = await db.ConsentForm.find({ adopter: userId })
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    return consentForms;
  } catch (error) {
    // console.error('Error fetching consent forms by user:', error);
    throw new Error(error);
  }
};

const getById = async (consentFormId) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId)
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }

    return consentForm;
  } catch (error) {
    // console.error('Error fetching consent form by ID:', error);
    throw new Error(error);
  }
};

const create = async (consentForm) => {
  try {
    const newConsentForm = new db.ConsentForm(consentForm);
    const savedConsentForm = await newConsentForm.save();
    if (!savedConsentForm) {
      throw new Error(
        "Lỗi khi lưu bản đồng ý nhận nuôi. Vui lòng thử lại sau."
      );
    }
    const populatedConsentForm = await db.ConsentForm.findById(
      savedConsentForm._id
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    return populatedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
};

const editForm = async (consentFormId, updateForm) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId)
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
    if (consentForm.status != "draft") {
      throw new Error(
        "Chỉ có thể chỉnh sửa bản đồng ý nhận nuôi trong trạng thái nháp."
      );
    }

    
    const updatedConsentForm = await db.ConsentForm.findByIdAndUpdate(
      consentFormId,
      updateForm,
      { new: true }
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");
  } catch (error) {
    throw new Error(error);
  }
};

const changeFormStatus = async (consentFormId, status) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId);
    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
    if (consentForm.status == "cancelled") {
      throw new Error("Bản đồng ý đã bị hủy, không thể thay đổi trạng thái.");
    }
  
    if (consentForm.status == "draft" && status != "send") {
      throw new Error("Không thể chuyển đến trạng thái này!");
    } 
    if ( (consentForm.status != "send" | "draft") && status == "draft") {  
      throw new Error("Không thể chuyển về trạng thái nháp!");
    }


    const updatedConsentForm = await db.ConsentForm.findByIdAndUpdate(
      consentFormId,
      { status: status },
      { new: true }
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name avatar status")
      .populate("createdBy", "_id fullName avatar status");

    if (!updatedConsentForm) {
      throw new Error(error);
    }

    return updatedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
}

const deleteForm = async (consentFormId) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId);
    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
    if (consentForm.status != "draft") {
      throw new Error(
        "Chỉ có thể xóa bản đồng ý trong trạng thái nháp."
      );
    }

    const deletedConsentForm = await db.ConsentForm.findByIdAndDelete(
      consentFormId
    );

    return deletedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
};

const consentFormService = {
  getByShelter,
  getByUser,
  getById,
  create,
  editForm,
  changeFormStatus,
  deleteForm
};

module.exports = consentFormService;
