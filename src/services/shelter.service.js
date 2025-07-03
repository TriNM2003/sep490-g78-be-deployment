const {
  Shelter,
  User,
  Pet,
  Post,
  Blog,
  Report,
  Donation,
} = require("../models/index");
const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs");
const generateCodename = require("../utils/codeNameGenerator");
const mongoose = require("mongoose");

//USER
async function getAll() {
  try {
    const shelters = await db.Shelter.find({ status: "active" })
      .populate("members._id")
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

const getShelterRequestByUserId = async (userId) => {
  try {
    const shelter = await Shelter.find({ "members._id": userId });
    let isEligible = true; //check dieu kien gui yeu cau
    let reason = "Đủ điều kiện để tạo yêu cầu thành lập trạm cứu hộ"; //ly do
    for (let i = 0; i < shelter.length; i++) {
      if (["banned"].includes(shelter[i].status)) {
        reason = "Bạn đã bị ban khỏi việc thành lập trạm cứu hộ!";
        isEligible = false;
        break;
      }
      if (["active"].includes(shelter[i].status)) {
        reason = "Bạn đã thuộc về một trạm cứu hộ!";
        isEligible = false;
        break;
      }
      if (["verifying"].includes(shelter[i].status)) {
        reason = "Bạn có yêu cầu đang chờ xử lý!";
        isEligible = false;
        break;
      }
    }
    return {
      isEligible,
      reason,
      shelterRequest: shelter.map((item) => {
        return {
          name: item.name,
          shelterCode: item.shelterCode,
          email: item.email,
          hotline: item.hotline,
          address: item.address,
          status: item.status,
          shelterLicenseURL: item.shelterLicense.url,
          aspiration: item.aspiration,
          rejectReason: item.rejectReason,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      }),
    };
  } catch (error) {
    throw error;
  }
};
const sendShelterEstablishmentRequest = async (
  requesterId,
  shelterRequestData,
  { shelterLicense }
) => {
  try {
    if (!shelterLicense[0]) {
      throw new Error(
        "Không tìm thấy giấy phép hoạt động! Vui lòng đính kèm giấy phép hoạt động"
      );
    }

    const isShelterCodeExist = await Shelter.findOne({
      shelterCode: shelterRequestData.shelterCode,
    });
    if (isShelterCodeExist) {
      throw new Error("Mã trạm đã tồn tại!");
    }

    const isNotEligible = await Shelter.findOne({
      "members._id": requesterId,
      status: { $in: ["active", "banned", "verifying"] },
    });
    if (isNotEligible) {
      // Xoa file o local
      fs.unlink(shelterLicense[0].path, (err) => {
        if (err) console.error("Lỗi xóa file ở local:", err);
      });
      throw new Error("Tài khoản không đủ điều kiện để gửi yêu cầu!");
    }

    const uploadResult = await cloudinary.uploader.upload(
      shelterLicense[0].path,
      {
        folder: "shelter_licenses",
        resource_type: "raw",
      }
    );
    // Xoa file o local
    fs.unlink(shelterLicense[0].path, (err) => {
      if (err) console.error("Lỗi xóa file ở local:", err);
    });

    const shelter = await Shelter.create({
      name: shelterRequestData.name,
      shelterCode: shelterRequestData.shelterCode,
      bio: "",
      email: shelterRequestData.email,
      hotline: shelterRequestData.hotline,
      avatar: "",
      address: shelterRequestData.address,
      background: "",
      members: [
        {
          _id: requesterId,
          roles: ["staff", "manager"],
        },
      ],
      shelterLicense: {
        fileName: shelterLicense[0]?.originalname,
        url: uploadResult?.secure_url,
        size: shelterLicense[0]?.size,
        mimeType: shelterLicense[0]?.mimetype,
        createAt: new Date(),
        updateAt: new Date(),
      },
      aspiration: shelterRequestData.aspiration,
      foundationDate: new Date(), //tam thoi
      status: "verifying",
      warningCount: 0,
    });

    return {
      status: 200,
      message: "Gửi yêu cầu thành lập trạm cứu hộ thành công",
      shelterRequest: shelter,
    };
  } catch (error) {
    // Xoa file o local
    fs.unlink(shelterLicense[0].path, (err) => {
      if (err) console.error("Lỗi xóa file ở local:", err);
    });
    throw error;
  }
};
const getShelterProfile = async (shelterId) => {
  try {
    const shelter = await Shelter.findById(shelterId);

    if (!shelter) {
      throw new Error("Không tìm thấy shelter");
    }

    return {
      _id: shelter._id,
      name: shelter.name,
      bio: shelter.bio,
      email: shelter.email,
      hotline: shelter.hotline,
      avatar: shelter.avatar,
      address: shelter.address,
      background: shelter.background,
    };
  } catch (error) {
    throw error;
  }
};

const editShelterProfile = async (shelterId, updatedData) => {
  try {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) {
      throw new Error("Không tìm thấy trạm cứu hộ để cập nhật");
    }

    const updatedFields = {};

    // Các trường cơ bản
    const basicFields = ["name", "bio", "email", "hotline", "address"];
    for (const field of basicFields) {
      if (updatedData[field] !== undefined) {
        updatedFields[field] = updatedData[field];
      }
    }

    // Upload avatar nếu có
    if (updatedData.avatar && typeof updatedData.avatar === "object") {
      const result = await cloudinary.uploader.upload(updatedData.avatar.path, {
        folder: "shelter_profiles",
        resource_type: "image",
      });
      updatedFields.avatar = result.secure_url;
      fs.unlink(updatedData.avatar.path, () => {}); // xóa file local
    }

    // Upload background nếu có
    if (updatedData.background && typeof updatedData.background === "object") {
      const result = await cloudinary.uploader.upload(
        updatedData.background.path,
        {
          folder: "shelter_profiles",
          resource_type: "image",
        }
      );
      updatedFields.background = result.secure_url;
      fs.unlink(updatedData.background.path, () => {}); // xóa file local
    }

    // Cập nhật vào MongoDB
    const updatedShelter = await Shelter.findByIdAndUpdate(
      shelterId,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    return {
      name: updatedShelter.name,
      bio: updatedShelter.bio,
      email: updatedShelter.email,
      hotline: updatedShelter.hotline,
      avatar: updatedShelter.avatar,
      address: updatedShelter.address,
      background: updatedShelter.background,
    };
  } catch (error) {
    throw error;
  }
};
const getShelterMembers = async (shelterId) => {
  try {
    const shelter = await Shelter.findById(shelterId).populate("members._id");
    if (!shelter) {
      throw new Error("Không tìm thấy shelter");
    }

    return shelter.members;
  } catch (error) {
    throw error;
  }
};

// 1. Tổng số thú đang chăm sóc (status: "caring" hoặc tương tự)
const getShelterCaringPetsCount = async (shelterId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(shelterId)) {
      throw new Error("Invalid shelter ID");
    }

    const count = await Pet.countDocuments({
      shelter: new mongoose.Types.ObjectId(shelterId),
    });

    console.log("Shelter id:", shelterId, "Pet count:", count);
    return count;
  } catch (error) {
    console.error("Lỗi ở getShelterCaringPetsCount:", error);
    throw error;
  }
};

// 2. Số thú đã được nhận nuôi
const getShelterAdoptedPetsCount = async (shelterId) => {
  try {
    const count = await Pet.countDocuments({
      shelter: shelterId,
      status: "adopted",
    });
    return count;
  } catch (error) {
    throw error;
  }
};

// 3. Số bài viết trạm đã đăng
const getShelterPostsCount = async (shelterId) => {
  try {
    const count = await Post.countDocuments({ shelter: shelterId });
    return count;
  } catch (error) {
    throw error;
  }
};

// 4. Số nhân viên & tình nguyện viên
const getShelterMembersCount = async (shelterId) => {
  try {
    const shelter = await Shelter.findById(shelterId);
    if (!shelter) throw new Error("Không tìm thấy shelter");
    return shelter.members.length;
  } catch (error) {
    throw error;
  }
};

// 5. Biểu đồ tăng trưởng số thú cưng theo tháng (6 tháng gần nhất)
const getShelterPetGrowthByMonth = async (shelterId) => {
  try {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const count = await Pet.countDocuments({
        shelter: shelterId,
        createdAt: { $gte: start, $lt: end },
      });
      months.push({
        month: `${start.getMonth() + 1}/${start.getFullYear()}`,
        count,
      });
    }
    return months;
  } catch (error) {
    throw error;
  }
};

// ADMIN
const getAllShelter = async () => {
  try {
    const shelters = await Shelter.find({
      status: { $in: ["active", "banned"] },
    });
    return shelters.map((shelter, index) => {
      return {
        _id: shelter?._id,
        avatar: shelter?.avatar,
        shelterCode: shelter?.shelterCode,
        name: shelter?.name,
        email: shelter?.email,
        hotline: shelter?.hotline,
        address: shelter?.address,
        createdBy: {
          fullName: shelter.members[0]._id.fullName,
          avatar: shelter.members[0]._id.avatar,
        },
        membersCount: shelter?.members.length,
        invitationsCount: shelter?.invitations.length,
        shelterLicenseURL: shelter?.shelterLicense.url,
        foundationDate: shelter?.foundationDate,
        warningCount: shelter?.warningCount,
        status: shelter?.status,
        createdAt: shelter?.createdAt,
        updatedAt: shelter?.updatedAt,
      };
    });
  } catch (error) {
    throw error;
  }
};
const getAllShelterEstablishmentRequests = async () => {
  try {
    const shelters = await Shelter.find({}).populate("members._id");
    return shelters.map((shelter, index) => {
      return {
        _id: shelter._id,
        avatar: shelter.avatar,
        shelterCode: shelter.shelterCode,
        status: shelter.status,
        name: shelter.name,
        email: shelter.email,
        hotline: shelter.hotline,
        address: shelter.address,
        aspiration: shelter.aspiration,
        createdBy: {
          fullName: shelter.members[0]._id.fullName,
          avatar: shelter.members[0]._id.avatar,
        },
        rejectReason: shelter.rejectReason,
        shelterLicenseURL: shelter.shelterLicense.url,
        createdAt: shelter.createdAt,
        updateAt: shelter.updatedAt,
      };
    });
  } catch (error) {
    throw error;
  }
};
const getOverviewStatistic = async () => {
  try {
    const calculateDifference = (current, before) => {
      return ["Infinity%", "NaN%"].includes(
        (((current - before) / before) * 100).toFixed(2) + "%"
      )
        ? "0%"
        : (((current - before) / before) * 100).toFixed(2) + "%";
    };
    // Dau thang
    const startOfThisMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const totalSheltersLastMonth = await Shelter.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const totalShelters = await Shelter.countDocuments();
    const shelterChangePercent = calculateDifference(
      totalShelters,
      totalSheltersLastMonth
    );

    const totalUsersLastMonth = await User.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const totalUsers = await User.countDocuments();
    const userChangePercent = calculateDifference(
      totalUsers,
      totalUsersLastMonth
    );

    const rescuedPetsLastMonth = await Pet.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const rescuedPets = await Pet.countDocuments();
    const rescuedPetsChangePercent = calculateDifference(
      rescuedPets,
      rescuedPetsLastMonth
    );

    const adoptedPetsLastMonth = await Pet.countDocuments({
      createdAt: { $lt: startOfThisMonth },
      status: "adopted",
    });
    const adoptedPets = await Pet.countDocuments({ status: "adopted" });
    const adoptedPetsChangePercent = calculateDifference(
      adoptedPets,
      adoptedPetsLastMonth
    );

    const totalPostsLastMonth = await Post.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const totalPosts = await Post.countDocuments();
    const totalPostsChangePercent = calculateDifference(
      totalPosts,
      totalPostsLastMonth
    );

    const totalBlogsLastMonth = await Blog.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const totalBlogs = await Blog.countDocuments();
    const totalBlogsChangePercent = calculateDifference(
      totalBlogs,
      totalBlogsLastMonth
    );

    const totalReportsLastMonth = await Blog.countDocuments({
      createdAt: { $lt: startOfThisMonth },
    });
    const totalReports = await Report.countDocuments();
    const totalReportsChangePercent = calculateDifference(
      totalReports,
      totalReportsLastMonth
    );

    const totalDonationLastMonth = await Donation.aggregate([
      {
        $match: {
          createdAt: { $lte: startOfThisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const donationAmountLastMonth = totalDonationLastMonth[0]?.total || 0;
    const totalDonation = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const donationAmount = totalDonation[0]?.total || 0;
    const donationAmountChangePercent = calculateDifference(
      totalDonation,
      donationAmountLastMonth
    );

    return {
      status: 200,
      message: "Lấy dữ liệu thống tổng quan thành công!",
      overviewStatistics: {
        shelter: {
          totalShelters,
          shelterChangePercent,
        },
        user: {
          totalUsers,
          userChangePercent,
        },
        pet: {
          rescuedPets: {
            current: rescuedPets,
            changePercent: rescuedPetsChangePercent,
          },
          adoptedPets: {
            current: adoptedPets,
            changePercent: adoptedPetsChangePercent,
          },
        },
        post: {
          totalPosts,
          totalPostsChangePercent,
        },
        blog: {
          totalBlogs,
          totalBlogsChangePercent,
        },
        report: {
          totalReports,
          totalReportsChangePercent,
        },
        donation: {
          donationAmount,
          donationAmountChangePercent,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};
const reviewShelterEstablishmentRequest = async ({
  requestId,
  decision = "reject",
  rejectReason = "No reason",
}) => {
  try {
    const shelter = await Shelter.findOne({ _id: requestId });
    if (!shelter) {
      throw new Error("Không tìm thấy shelter với requestId đã cho.");
    }
    if (["active", "banned", "rejected"].includes(shelter.status)) {
      throw new Error("Yêu cầu đã được xử lý trong quá khứ!");
    }

    // hoan thanh viec thanh lap shelter
    if (decision === "approve") {
      await Shelter.findOneAndUpdate({ _id: requestId }, { status: "active" });
    } else if (decision === "reject") {
      await Shelter.findOneAndUpdate(
        { _id: requestId },
        { status: "rejected", rejectReason: rejectReason }
      );
      return {
        status: 200,
        message: "Xử lý yêu cầu thành lập shelter thành công",
        decision: decision === "approve" ? "Chấp thuận" : "Từ chối",
      };
    } else {
      throw new Error("Thiếu quyết định!");
    }

    // reject cac yeu cau moi vao shelter (neu co)

    return {
      status: 200,
      message: "Xử lý yêu cầu thành lập shelter thành công",
      decision: decision === "approve" ? "Chấp thuận" : "Từ chối",
    };
  } catch (error) {
    throw error;
  }
};

const shelterService = {
  // USER
  getAll,
  sendShelterEstablishmentRequest,
  getShelterRequestByUserId,
  getShelterProfile,
  editShelterProfile,
  getShelterMembers,
  getShelterCaringPetsCount,
  getShelterAdoptedPetsCount,
  getShelterPostsCount,
  getShelterMembersCount,
  getShelterPetGrowthByMonth,

  // ADMIN
  getAllShelter,
  getAllShelterEstablishmentRequests,
  getOverviewStatistic,
  reviewShelterEstablishmentRequest,
};

module.exports = shelterService;
