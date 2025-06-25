const {Shelter, User, Pet, Post, Blog, Report, Donation} = require("../models/index")
const {cloudinary} = require("../configs/cloudinary");
const fs = require("fs");

//USER
const sendShelterEstablishmentRequest = async (requesterId, shelterRequestData, {shelterLicense}) => {
    try {
        if(!shelterLicense[0]){
          throw new Error("Không tìm thấy giấy phép hoạt động! Vui lòng đính kèm giấy phép hoạt động")
        }

        const isRequestOrShelterExist = await Shelter.findOne({"members._id": requesterId});
        if(isRequestOrShelterExist){
          throw new Error("Yêu cầu đã tồn tại hoặc tài khoản đã thuộc một trạm cứu hộ!")
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
          bio: "",
          email: shelterRequestData.email,
          hotline: shelterRequestData.hotline,
          avatar: "",
          address: shelterRequestData.address,
          background: "",
          members: [
            {
                _id: requesterId,
                roles: ["staff", "manager"]
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
            message: "Gửi yêu cầu thành lập shelter thành công",
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
        const shelters = await Shelter.find({
          status: { $in: ["active", "banned"] },
        });
        return shelters.map((shelter, index) => {
          return {
            index: index+1,
            _id: shelter?._id,
            avatar: shelter?.avatar,
            name: shelter?.name,
            email: shelter?.email,
            hotline: shelter?.hotline,
            address: shelter?.address,
            membersCount: shelter?.members.length,
            shelterLicenseURL: shelter?.shelterLicense.url,
            foundationDate: shelter?.foundationDate,
            warningCount: shelter?.warningCount,
            status: shelter?.status,
            createdAt: shelter?.createdAt,
            updateAt: shelter?.updatedAt,
          };
        });
    } catch (error) {
        throw error;
    }
}
const getAllShelterEstablishmentRequests = async () => {
    try {
        const shelters = await Shelter.find({
          status: { $in: ["verifying"] },
        });
        return shelters.map((shelter, index) => {
          return {
            index: index + 1,
            _id: shelter._id,
            avatar: shelter.avatar,
            name: shelter.name,
            email: shelter.email,
            hotline: shelter.hotline,
            address: shelter.address,
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
const reviewShelterEstablishmentRequest = async ({shelterId, decision = "reject"}) => {
    try {
        if (decision === "approve") {
          await Shelter.findOneAndUpdate([
            { _id: shelterId },
            { status: "rejected" },
          ]);
        } else if (decision === "reject") {
          await Shelter.findOneAndUpdate([
            { _id: shelterId },
            { status: "active" },
          ]);
        }else{
            throw new Error("Thiếu quyết định!")
        }
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

  // ADMIN
  getAllShelter,
  getAllShelterEstablishmentRequests,
  getOverviewStatistic,
  reviewShelterEstablishmentRequest,
};

module.exports = shelterService; 