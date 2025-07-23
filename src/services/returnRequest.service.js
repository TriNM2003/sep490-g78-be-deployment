const db = require("../models");
const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs/promises");
const NotificationService = require("./notification.service");

const createReturnRequest = async (userId, data, files) => {
  const uploadedPhotoUrls = [];

  try {
    const { pet, shelter, reason } = data;
    if (!pet || !shelter) throw new Error("Thiếu thông tin pet hoặc shelter");
    if (!reason || reason.trim() === "") throw new Error("Lý do là bắt buộc");
    if (!files || files.length === 0) {
      throw new Error("Cần ít nhất một ảnh");
    }
    if (files.length > 5) {
      throw new Error("Chỉ được tải lên tối đa 5 ảnh");
    }

    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "return-requests",
          resource_type: "image",
        });
        uploadedPhotoUrls.push(result.secure_url);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Lỗi khi upload ảnh lên Cloudinary");
      } finally {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.warn("Không thể xoá file tạm:", file.path);
        }
      }
    }

    const returnRequest = await db.ReturnRequest.create({
      requestedBy: userId,
      pet,
      shelter,
      reason,
      photos: uploadedPhotoUrls,
      status: "pending",
    });

    const shelterDoc = await db.Shelter.findById(shelter);
    if (!shelterDoc) throw new Error("Không tìm thấy shelter");

    const receiverIds = shelterDoc.members
      .filter((m) => m.roles.includes("manager") || m.roles.includes("staff"))
      .map((m) => m._id);

    if (receiverIds.length === 0) {
      throw new Error(
        "Shelter không có thành viên nào hợp lệ để nhận thông báo"
      );
    }

    await NotificationService.createNotification(
      userId,
      receiverIds,
      "Có một yêu cầu trả thú cưng mới",
      "other",
      `/shelter/return-requests/${returnRequest._id}`
    );

    return returnRequest;
  } catch (error) {
    for (const file of files) {
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.warn("Không thể xoá file tạm:", file.path);
      }
    }
    console.error("Lỗi khi tạo yêu cầu trả thú cưng:", error);
    throw new Error("Lỗi khi tạo yêu cầu trả thú cưng: " + error.message);
  }
};

const updateReturnRequest = async (requestId, userId, updateData, files) => {
  const uploadedPhotoUrls = [];

  try {
    if (!requestId || !userId) {
      throw new Error("Request ID và User ID là bắt buộc");
    }
    if (!updateData.reason || updateData.reason.trim() === "") {
      throw new Error("Lý do trả thú cưng là bắt buộc");
    }
    if (!files || files.length === 0) {
      throw new Error("Cần ít nhất một ảnh");
    }
    if (files.length > 5) {
      throw new Error("Tối đa 5 ảnh được phép tải lên");
    }

    const request = await db.ReturnRequest.findById(requestId);
    if (!request) throw new Error("Không tìm thấy yêu cầu");

    if (!request.requestedBy.equals(userId)) {
      throw new Error("Bạn không có quyền chỉnh sửa yêu cầu này");
    }

    if (request.status !== "pending") {
      throw new Error("Chỉ có thể chỉnh sửa yêu cầu khi đang chờ duyệt");
    }

    const existingPhotos = request.photos || [];

    for (const file of files) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "return-requests",
          resource_type: "image",
        });
        uploadedPhotoUrls.push(result.secure_url);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Lỗi khi upload ảnh lên Cloudinary");
      } finally {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.warn("Không thể xoá file tạm:", file.path);
        }
      }
    }

    const updatedRequest = await db.ReturnRequest.findByIdAndUpdate(
      requestId,
      {
        reason: updateData.reason,
        photos: [...existingPhotos, ...uploadedPhotoUrls],
      },
      { new: true }
    );

    const shelter = await db.Shelter.findById(request.shelter);
    if (!shelter) throw new Error("Không tìm thấy shelter");

    const receiverIds = shelter.members.map((m) => m._id);
    const validReceivers = await db.User.find({
      _id: { $in: receiverIds },
      status: { $ne: "banned" },
    });

    if (!validReceivers.length) {
      throw new Error("Shelter không có người nhận thông báo hợp lệ");
    }

    await NotificationService.createNotification(
      userId,
      validReceivers.map((u) => u._id),
      `Yêu cầu trả thú cưng đã được cập nhật.`,
      "other",
      `/shelter/return-requests/${requestId}`
    );

    return updatedRequest;
  } catch (error) {
    for (const file of files) {
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.warn("Không thể xoá file tạm:", file.path);
      }
    }
    throw new Error(`Lỗi khi cập nhật yêu cầu trả thú cưng: ${error.message}`);
  }
};

// const getReturnRequests = async ({ userId, shelterId }) => {
//   const query = {};
//   try {
//     if (!userId && !shelterId) {
//       throw new Error("Either userId or shelterId must be provided");
//     }
//     if (userId) query.requestedBy = userId;
//     if (shelterId) query.shelter = shelterId;

//     return db.ReturnRequest.find(query)
//       .populate("pet requestedBy shelter approvedBy")
//       .sort({ createdAt: -1 });
//   } catch (error) {
//     throw new Error(`Error fetching return requests: ${error.message}`);
//   }
// };

const getReturnRequestsByUser = async (userId) => {
  try {
    if (!userId) throw new Error("userId is required");

    return await db.ReturnRequest.find({ requestedBy: userId })
      .populate("pet requestedBy shelter approvedBy")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(`Error fetching return requests by user: ${error.message}`);
  }
};

const getReturnRequestsByShelter = async (shelterId) => {
  try {
    if (!shelterId) throw new Error("shelterId is required");

    return await db.ReturnRequest.find({ shelter: shelterId })
      .populate("pet requestedBy shelter approvedBy")
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error(
      `Error fetching return requests by shelter: ${error.message}`
    );
  }
};

const deleteReturnRequest = async (requestId, userId) => {
  try {
    if (!requestId || !userId) {
      throw new Error("Request ID and user ID are required");
    }
    const request = await db.ReturnRequest.findById(requestId);
    if (!request) throw new Error("Request not found");

    if (!request.requestedBy.equals(userId)) {
      throw new Error("Permission denied");
    }

    if (request.status === "pending") {
      await db.ReturnRequest.findByIdAndUpdate(
        requestId,
        { status: "cancelled" },
        { new: true }
      );
      return { message: "Request cancelled" };
    }
  } catch (error) {
    throw new Error(`Error deleting return request: ${error.message}`);
  }
};

const approveReturnRequest = async (requestId, shelterUserId) => {
  try {
    if (!requestId || !shelterUserId) {
      throw new Error("Request ID and shelter user ID are required");
    }
    const request = await db.ReturnRequest.findById(requestId).populate("pet");
    if (!request) throw new Error("Request not found");

    if (request.status !== "pending") {
      throw new Error("Cannot approve non-pending request");
    }

    await db.ReturnRequest.findByIdAndUpdate(
      requestId,
      { status: "approved", approvedBy: shelterUserId },
      { new: true }
    );

    await db.Pet.findByIdAndUpdate(
      request.pet._id,
      { status: "unavailable" },
      { new: true }
    );

    await db.AdoptionForm.updateMany(
      { pet: request.pet._id, status: "approved" },
      { status: "draft" }
    );

    await db.AdoptionSubmission.updateMany(
      { pet: request.pet._id, status: "approved" },
      { status: "rejected" }
    );

    return request;
  } catch (error) {
    throw new Error(`Error approving return request: ${error.message}`);
  }
};

const rejectReturnRequest = async (requestId, shelterUserId) => {
  try {
    if (!requestId || !shelterUserId) {
      throw new Error("Request ID and shelter user ID are required");
    }
    const request = await db.ReturnRequest.findById(requestId);
    if (!request) throw new Error("Request not found");

    if (request.status !== "pending") {
      throw new Error("Cannot reject non-pending request");
    }

    await db.ReturnRequest.findByIdAndUpdate(
      requestId,
      { status: "rejected", approvedBy: shelterUserId },
      { new: true }
    );

    return request;
  } catch (error) {
    throw new Error(`Error rejecting return request: ${error.message}`);
  }
};

const returnRequestService = {
  createReturnRequest,
  updateReturnRequest,
  //getReturnRequests,
  getReturnRequestsByUser,
  getReturnRequestsByShelter,
  deleteReturnRequest,
  approveReturnRequest,
  rejectReturnRequest,
};

module.exports = returnRequestService;
