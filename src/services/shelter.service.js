const {Shelter, User, Pet, Post, Blog, Report, Donation} = require("../models/index")
const {cloudinary} = require("../configs/cloudinary");
const fs = require("fs");
const generateCodename = require("../utils/codeNameGenerator");

//USER
const getShelterRequestByUserId = async (userId) => {
  try {
      const shelter = await Shelter.find({"members._id": userId});
      let isEligible = true;  //check dieu kien gui yeu cau
      let reason = 'Đủ điều kiện để tạo yêu cầu thành lập trạm cứu hộ' //ly do
      for(let i=0; i< shelter.length; i++) {
        if(["banned"].includes(shelter[i].status)){
          reason = "Bạn đã bị ban khỏi việc thành lập trạm cứu hộ!"
          isEligible = false;
          break;
        }
        if(["active"].includes(shelter[i].status)){
          reason = "Bạn đã thuộc về một trạm cứu hộ!"
          isEligible = false;
          break;
        }
        if(["verifying"].includes(shelter[i].status)){
          reason = "Bạn có yêu cầu đang chờ xử lý!"
          isEligible = false;
          break;
        }
      };
      return {
        isEligible,
        reason,
        shelterRequest: shelter.map(item => {
          return {
            name: item.name,
            email: item.email,
            hotline: item.hotline,
            address: item.address,
            status: item.status,
            shelterLicenseURL: item.shelterLicense.url,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        })
      };
  } catch (error) {
    throw error;
  }
}
const sendShelterEstablishmentRequest = async (requesterId, shelterRequestData, {shelterLicense}) => {
    try {
        if(!shelterLicense[0]){
          throw new Error("Không tìm thấy giấy phép hoạt động! Vui lòng đính kèm giấy phép hoạt động")
        }

        const isNotEligible = await Shelter.findOne({
          "members._id": requesterId,
          status: { $in: ["active", "banned", "verifying"] },
        });
        if(isNotEligible){
          // Xoa file o local
          fs.unlink(shelterLicense[0].path, (err) => {
            if (err) console.error("Lỗi xóa file ở local:", err);
          });
          throw new Error(
            "Tài khoản không đủ điều kiện để gửi yêu cầu!"
          );
        }

        const uploadResult = await cloudinary.uploader.upload(shelterLicense[0].path, {
          folder: "shelter_licenses",
          resource_type: "image",
        });
        // Xoa file o local
        fs.unlink(shelterLicense[0].path, (err) => {
          if (err)
            console.error("Lỗi xóa file ở local:", err);
        });

        const shelter = await Shelter.create({
          name: shelterRequestData.name,
          shelterCode: generateCodename(shelterRequestData.name),
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
            }
          ],
          shelterLicense: {
            fileName: shelterLicense[0]?.originalname,
            url: uploadResult?.secure_url,
            size: shelterLicense[0]?.size,
            mimeType: shelterLicense[0]?.mimetype,
            createAt: new Date(),
            updateAt: new Date()
          },
          foundationDate: new Date(),  //tam thoi
          status: "verifying",
          warningCount: 0,
        });
        
        return {
            status: 200,
            message: "Gửi yêu cầu thành lập trạm cứu hộ thành công",
            shelterRequest: shelter
        }
    } catch (error) {
        // Xoa file o local
        fs.unlink(shelterLicense[0].path, (err) => {
          if (err)
            console.error("Lỗi xóa file ở local:", err);
        });
        throw error;
    }
}


// ADMIN
const getAllShelter = async () => {
    try {
        const shelters = await Shelter.find({status: {$in: ["active", "banned"]}});
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
}
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
            createdBy: {
              fullName: shelter.members[0]._id.fullName,
              avatar: shelter.members[0]._id.avatar,
            },
            shelterLicenseURL: shelter.shelterLicense.url,
            createdAt: shelter.createdAt,
            updateAt: shelter.updatedAt,
          };
        });
    } catch (error) {
        throw error;
    }
}
const getOverviewStatistic = async () => {
    try {
        const calculateDifference = (current, before) => {
            return ["Infinity%", "NaN%"].includes(((current - before) / before * 100).toFixed(2) + "%") 
            ? "0%" 
            : (((current - before) / before * 100).toFixed(2) + "%");
        }
        // Dau thang
        const startOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        const totalSheltersLastMonth = await Shelter.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const totalShelters = await Shelter.countDocuments();
        const shelterChangePercent = calculateDifference(totalShelters, totalSheltersLastMonth);

        const totalUsersLastMonth = await User.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const totalUsers = await User.countDocuments();
        const userChangePercent = calculateDifference(totalUsers, totalUsersLastMonth);

        const rescuedPetsLastMonth = await Pet.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const rescuedPets = await Pet.countDocuments();
        const rescuedPetsChangePercent = calculateDifference(rescuedPets, rescuedPetsLastMonth);

        const adoptedPetsLastMonth = await Pet.countDocuments({createdAt: { $lt: startOfThisMonth}, status: "adopted"});
        const adoptedPets = await Pet.countDocuments({ status: "adopted" });
        const adoptedPetsChangePercent = calculateDifference(adoptedPets, adoptedPetsLastMonth);

        const totalPostsLastMonth = await Post.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const totalPosts = await Post.countDocuments();
        const totalPostsChangePercent = calculateDifference(totalPosts, totalPostsLastMonth);

        const totalBlogsLastMonth = await Blog.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const totalBlogs = await Blog.countDocuments();
        const totalBlogsChangePercent = calculateDifference(totalBlogs, totalBlogsLastMonth);

        const totalReportsLastMonth = await Blog.countDocuments({createdAt: { $lt: startOfThisMonth}});
        const totalReports = await Report.countDocuments();
        const totalReportsChangePercent = calculateDifference(totalReports, totalReportsLastMonth);

        const totalDonationLastMonth = await Donation.aggregate([
          {
            $match: {
              createdAt: { $lte: startOfThisMonth},
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const donationAmountLastMonth = totalDonationLastMonth[0]?.total || 0;
        const totalDonation = await Donation.aggregate([
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        const donationAmount = totalDonation[0]?.total || 0;
        const donationAmountChangePercent = calculateDifference(totalDonation, donationAmountLastMonth);

        return {
            status: 200,
            message: "Lấy dữ liệu thống tổng quan thành công!",
            overviewStatistics: {
                shelter: {
                    totalShelters,
                    shelterChangePercent
                },
                user: {
                    totalUsers,
                    userChangePercent,
                },
                pet: {
                    rescuedPets: {
                        current: rescuedPets,
                        changePercent: rescuedPetsChangePercent
                    },
                    adoptedPets: {
                        current: adoptedPets,
                        changePercent: adoptedPetsChangePercent
                    }
                },
                post: {
                    totalPosts,
                    totalPostsChangePercent
                },
                blog: {
                    totalBlogs,
                    totalBlogsChangePercent
                },
                report: {
                    totalReports,
                    totalReportsChangePercent
                },
                donation: {
                    donationAmount,
                    donationAmountChangePercent
                }
            }
        };
    } catch (error) {
        throw error;
    }
}
const reviewShelterEstablishmentRequest = async ({requestId, decision = "reject"}) => {
    try {
        const shelter = await Shelter.findOne({_id: requestId});
        if (!shelter) {
          throw new Error("Không tìm thấy shelter với requestId đã cho.");
        }
        if(["active", "banned", "rejected"].includes(shelter.status)){
          throw new Error("Yêu cầu đã được xử lý trong quá khứ!")
        }

        // hoan thanh viec thanh lap shelter
        if (decision === "approve") {
          await Shelter.findOneAndUpdate(
            { _id: requestId },
            { status: "active" },
          );
        } else if (decision === "reject") {
          await Shelter.findOneAndUpdate(
            { _id: requestId },
            { status: "rejected" },
          );
          return {
            status: 200,
            message: "Xử lý yêu cầu thành lập shelter thành công",
            decision: decision === "approve" ? "Chấp thuận" : "Từ chối"
          }
        }else{
            throw new Error("Thiếu quyết định!")
        }

        // reject cac yeu cau moi vao shelter (neu co)
        

        return {
            status: 200,
            message: "Xử lý yêu cầu thành lập shelter thành công",
            decision: decision === "approve" ? "Chấp thuận" : "Từ chối"
        }
    } catch (error) {
        throw error;
    }
}


const shelterService = {
  // USER
  sendShelterEstablishmentRequest,
  getShelterRequestByUserId,

  // ADMIN
  getAllShelter,
  getAllShelterEstablishmentRequests,
  getOverviewStatistic,
  reviewShelterEstablishmentRequest,
};

module.exports = shelterService; 