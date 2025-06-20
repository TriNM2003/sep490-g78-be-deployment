const db = require("../models/");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../configs/cloudinary");
const fs = require("fs");

const getAllUsers = async () => {
  try {
    const users = await db.User.find();
    return users;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

const changePassword = async (
  userId,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) throw new Error("User not found");
    if (newPassword !== confirmPassword)
      throw new Error("New password and confirmation do not match");
    if (newPassword.length < 8)
      throw new Error("New password must be at least 8 characters long");
    if (/\s/.test(newPassword))
      throw new Error("New password cannot contain spaces");
    const isNewPasswordSameAsOld = await bcrypt.compare(
      newPassword,
      user.password
    );
    if (isNewPasswordSameAsOld)
      throw new Error("New password cannot be the same as the old password");
    if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword))
      throw new Error(
        "New password must contain at least one uppercase letter and one number"
      );
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};

const editProfile = async (userId, profileData, files) => {
  const tempFilePaths = [];
  try {
    const user = await db.User.findById(userId);
    if (!user) throw new Error("User not found");

    let newAvatar = user.avatar;
    let newBackground = user.background;

    if (files?.avatar?.length > 0) {
      tempFilePaths.push(files.avatar[0].path);
    }
    if (files?.background?.length > 0) {
      tempFilePaths.push(files.background[0].path);
    }
    // Xử lý file avatar
    if (files?.avatar?.length > 0) {
      try {
        const avatarFile = files.avatar[0];
        const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
          folder: "user_profiles",
          resource_type: "image",
        });
        newAvatar = uploadResult.secure_url;
        fs.unlink(avatarFile.path, (err) => {
          if (err) console.error("Error deleting local avatar file:", err);
        });
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        for (const filePath of tempFilePaths) {
          fs.unlink(filePath, (err) => {
            if (err)
              console.error("Error deleting file in catch:", filePath, err);
          });
        }
        throw new Error("Lỗi khi tải lên ảnh đại diện. Vui lòng thử lại.");
      }
    }

    // Xử lý file background
    if (files?.background?.length > 0) {
      try {
        const backgroundFile = files.background[0];
        const uploadResult = await cloudinary.uploader.upload(
          backgroundFile.path,
          {
            folder: "user_profiles",
            resource_type: "image",
          }
        );
        newBackground = uploadResult.secure_url;
        fs.unlink(backgroundFile.path, (err) => {
          if (err) console.error("Error deleting local background file:", err);
        });
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        for (const filePath of tempFilePaths) {
          fs.unlink(filePath, (err) => {
            if (err)
              console.error("Error deleting file in catch:", filePath, err);
          });
        }
        throw new Error("Lỗi khi tải lên ảnh nền. Vui lòng thử lại.");
      }
    }

    if (
      profileData.fullName &&
      !/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(profileData.fullName)
    ) {
      throw new Error(
        "Họ và tên không hợp lệ. Hoặc tên chỉ chứa chữ cái và khoảng trắng"
      );
    }
    if (
      profileData.phoneNumber &&
      !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(profileData.phoneNumber)
    ) {
      throw new Error(
        "Số điện thoại không hợp lệ. Số điện thoại phải bắt đầu bằng 03, 05, 07, 08 hoặc 09 và có 10 chữ số."
      );
    }
    if (profileData.dob) {
      const dob = new Date(profileData.dob); // Chuyển đổi ngày sinh từ string sang Date object
      const today = new Date(); // Lấy ngày hiện tại

      // Tính tuổi theo năm
      const age = today.getFullYear() - dob.getFullYear();

      // Kiểm tra đã qua sinh nhật trong năm chưa
      const hasBirthdayPassed =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
          today.getDate() >= dob.getDate());

      // Nếu chưa qua sinh nhật, giảm 1 tuổi
      const exactAge = hasBirthdayPassed ? age : age - 1;


      // Validate: phải đủ 16 tuổi trở lên
      if (exactAge < 16) {
        throw new Error("Ngày sinh không hợp lệ. Bạn phải đủ 16 tuổi trở lên");
      }
    }

    const newProfile = {
      fullName: profileData.fullName || user.fullName,
      bio: profileData.bio || user.bio,
      dob: profileData.dob ? new Date(profileData.dob) : user.dob,
      phoneNumber: profileData.phoneNumber || user.phoneNumber,
      address: profileData.address || user.address,
      avatar: newAvatar,
      background: newBackground,
    };
    const updatedUser = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName: newProfile.fullName,
          bio: newProfile.bio,
          dob: newProfile.dob,
          phoneNumber: newProfile.phoneNumber,
          address: newProfile.address,
          avatar: newProfile.avatar,
          background: newProfile.background,
        },
      },
      { new: true }
    );
    console.log("Updated user:", updatedUser);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
const userService = {
  getAllUsers,
  getUserById,
  changePassword,
  editProfile,
};

module.exports = userService;
