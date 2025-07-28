const  {cloudinary}  = require("../configs/cloudinary");
const db = require("../models");
const fs = require("fs/promises");

const getByShelter = async (shelterId) => {
  try {
    const consentForms = await db.ConsentForm.find({ shelter: shelterId })
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name photos petCode status")
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
      .populate("pet", "_id name photos petCode status")
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
      .populate("pet", "_id name photos petCode status")
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

const createForm = async (consentForm) => {
  try {
    const attachmentsRaw = consentForm.attachments;

    const attachments = [];

    if (attachmentsRaw && attachmentsRaw.length > 0) {
      for (const attachment of attachmentsRaw) {
        const { originalname, path, size, mimetype } = attachment;
        try {
          const uploadedPhoto = await cloudinary.uploader.upload(path, {
            folder: "consentForms",
            resource_type: "auto",
          });
          if(!uploadedPhoto){
            throw Error(
              "Lỗi khi upload tệp đính kèm!"
            );
          }
          attachments.push({
            fileName: originalname,
            url: uploadedPhoto.secure_url,
            size: size || 0,
            mimeType: mimetype ,
          });

          await fs.unlink(attachment.path);

        } catch (error) {
          throw new Error(error);
        }
      }
    }

    const newConsentForm = new db.ConsentForm({
      ...consentForm,
      attachments: attachments,
      status: "draft",
    });
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
      .populate("pet", "_id name photos petCode status")
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
      .populate("pet", "_id name photos petCode status")
      .populate("createdBy", "_id fullName avatar status");

    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
    if (consentForm.status != "draft") {
      throw new Error(
        "Chỉ có thể chỉnh sửa bản đồng ý nhận nuôi trong trạng thái nháp."
      );
    }
    const attachmentsRaw = updateForm.attachments;

    const attachments = [];

    if (attachmentsRaw && attachmentsRaw.length > 0) {
      for (const attachment of attachmentsRaw) {
        const { originalname, path, size, mimetype } = attachment;
        try {
          const uploadedPhoto = await cloudinary.uploader.upload(path, {
            folder: "consentForms",
            resource_type: "auto",
          });
          if(!uploadedPhoto){
            throw Error(
              "Lỗi khi upload tệp đính kèm!"
            );
          }
          attachments.push({
            fileName: originalname,
            url: uploadedPhoto.secure_url,
            size: size || 0,
            mimeType: mimetype || "application/octet-stream",
          });

          await fs.unlink(attachment.path);

        } catch (error) {
          throw new Error(error);
        }
      }
    }

    const updatedConsentForm = await db.ConsentForm.findByIdAndUpdate(
      consentFormId,
      {
        ...updateForm,
        attachments: attachments,
      },
      { new: true }
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name photos petCode status")
      .populate("createdBy", "_id fullName avatar status");

    if (!updatedConsentForm) {
      throw new Error(
        "Lỗi khi cập nhật bản đồng ý nhận nuôi. Vui lòng thử lại sau."
      );
    }
    return updatedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
};

const changeFormStatusShelter = async (consentFormId, status) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId);
    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
   

    if (consentForm.status == "draft" && status != "send") {
      throw new Error("Không thể chuyển đến trạng thái này!");
    }
    if ((consentForm.status == "approved" || "accepted") && status == "draft") {
      throw new Error("Không thể chuyển về trạng thái nháp!");
    }

    const updatedConsentForm = await db.ConsentForm.findByIdAndUpdate(
      consentFormId,
      { status: status },
      { new: true }
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name photos petCode status")
      .populate("createdBy", "_id fullName avatar status");

    if (!updatedConsentForm) {
      throw new Error(error);
    }

    return updatedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
};

const changeFormStatusUser = async (consentFormId, status, userId) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId);
    
    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }

    if (consentForm.adopter != userId) {
      throw new Error("Bạn không có quyền thay đổi trạng thái bản đồng ý này.");
    }

    if (consentForm.status == "draft" && status != "send") {
      throw new Error("Không thể chuyển đến trạng thái này!");
    }
    if ((consentForm.status == "approved" || "accepted") && status == "draft") {
      throw new Error("Không thể chuyển về trạng thái nháp!");
    }

    const updatedConsentForm = await db.ConsentForm.findByIdAndUpdate(
      consentFormId,
      { status: status },
      { new: true }
    )
      .populate("shelter", "_id name avatar status")
      .populate("adopter", "_id fullName avatar status")
      .populate("pet", "_id name photos petCode status")
      .populate("createdBy", "_id fullName avatar status");

    if (!updatedConsentForm) {
      throw new Error(error);
    }

    return updatedConsentForm;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteForm = async (consentFormId) => {
  try {
    const consentForm = await db.ConsentForm.findById(consentFormId);
    if (!consentForm) {
      throw new Error("Không tìm thấy bản đồng ý với ID đã cho.");
    }
    if (consentForm.status != "draft") {
      throw new Error("Chỉ có thể xóa bản đồng ý trong trạng thái nháp.");
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
  createForm,
  editForm,
  changeFormStatusShelter,
  changeFormStatusUser,
  deleteForm,
};

module.exports = consentFormService;
