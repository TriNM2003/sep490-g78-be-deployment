const db = require("../models/");

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
    if (newPassword === oldPassword)
      throw new Error("New password cannot be the same as the old password");
    if (!/[A-Z]/.test(newPassword) || !/\d/.test(newPassword))
      throw new Error(
        "New password must contain at least one uppercase letter and one number"
      );
    if (user.password !== oldPassword)
      throw new Error("Old password is incorrect");

    user.password = newPassword;
    await db.User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );
    return { message: "Password changed successfully" };
  } catch (error) {
    throw error;
  }
};

const editProfile = async (userId, profileData) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) throw new Error("User not found");

    if (
      profileData.fullName &&
      !/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/.test(profileData.fullName)
    ) {
      throw new Error(
        "Full name is invalid. Only letters and spaces are allowed"
      );
    }
    if (
      profileData.phoneNumber &&
      !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(profileData.phoneNumber)
    ) {
      throw new Error(
        "Phone number is invalid. Please enter a valid phone number"
      );
    }

    const newProfile = {
      fullName: profileData.fullName || user.fullName,
      bio: profileData.bio || user.bio,
      phoneNumber: profileData.phoneNumber || user.phoneNumber,
    };
    const updatedUser = await db.User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName: newProfile.fullName,
          bio: newProfile.bio,
          phoneNumber: newProfile.phoneNumber,
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
