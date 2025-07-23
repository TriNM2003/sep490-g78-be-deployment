const { consentFormService } = require("../services");

async function getByShelter(req, res, next) {
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
  try {
    const consentForms = await consentFormService.getByShelter(shelterId);
    res.status(200).json(consentForms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getByUser(req, res, next) {
  const { id } = req.payload;
  const selectedUser = await db.User.findOne({
    _id: id,
    status: "active",
  });
  if (!selectedUser) {
    return res
      .status(404)
      .json({ message: "Người dùng không tồn tại hoặc không hoạt động" });
  }
  try {
    const consentForms = await consentFormService.getByUser(id);
    res.status(200).json(consentForms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getById(req, res, next) {
  const { consentFormId } = req.params;
  try {
    const consentForm = await consentFormService.getById(consentFormId);
    if (!consentForm) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản đồng ý nhận nuôi!" });
    }
    res.status(200).json(consentForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function createForm(req, res, next) {
  const { shelterId } = req.params;
  const { id } = req.payload;
  const { commitments, tokenMoney, deliveryMethod, note, address, petId } = req.body;

  const selectedShelter = await db.Shelter.findOne({
    _id: shelterId,
    status: "active",
  });
  if (!selectedShelter) {
    return res
      .status(404)
      .json({ message: "Trung tâm không tồn tại hoặc không hoạt động" });
  }
  const selectedPet = await db.Pet.findOne({
    _id: petId,
    status: "available",
  });
  if (!selectedPet) {
    return res
      .status(404)
      .json({ message: "Thú cưng không khả dụng" });
  }
  if (!commitments || commitments.trim() == "" || deliveryMethod == "" || !address) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }



  try {
    const newConsentForm = await consentFormService.create({
      shelter: shelterId,
      pet: petId,
      commitments,
      tokenMoney,
      deliveryMethod,
      note,
      address,
      createdBy: id, 
    });

    res.status(201).json(newConsentForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function editForm(req, res, next) {
  const { consentFormId } = req.params;
  const { commitments, tokenMoney, deliveryMethod, note, address } = req.body;

  try {
    const updatedConsentForm = await consentFormService.editForm(
      consentFormId,
      {
        commitments,
        tokenMoney,
        deliveryMethod,
        note,
        address,
      }
    );
    res.status(200).json(updatedConsentForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function changeFormStatus(req, res, next) {
  const { consentFormId } = req.params;
  const { status } = req.body;

  if (!["draft", "send", "accepted", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  try {
    const updatedConsentForm = await consentFormService.changeFormStatus(
      consentFormId,
      status
    );
    res.status(200).json(updatedConsentForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteForm(req, res, next) {
  const { consentFormId } = req.params;

  try {
    const deletedConsentForm = await consentFormService.deleteForm(consentFormId);
    res.status(200).json(deletedConsentForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const consentFormController = {
  getByShelter,
  getByUser,
  getById,
  createForm,
  editForm,
  changeFormStatus,
  deleteForm,
};

module.exports = consentFormController;
