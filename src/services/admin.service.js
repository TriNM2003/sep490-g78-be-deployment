const db = require("../models");
const bcrypt = require("bcrypt");

const addUser = async (data) => {
  try {
    const userData = {
      fullName: data.fullName,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
      roles: data.roles || ["user"],
      status: "active",
      googleId: null
    };
    const newUser = await db.User.create(userData);
    return {
        message: "User added successfully",
        user: {
            id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            avatar: newUser.avatar,
            roles: newUser.roles,
            status: newUser.status,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,   
        }
    };

  } catch (error) {
    throw new Error("Error adding user: " + error.message);
  }
};

const changeUserRole = async (userId, roles) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await db.User.findByIdAndUpdate(
      userId,
      { roles: roles },
      { new: true }
    );
    return {
        message: "User roles updated successfully",
        user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            roles: updatedUser.roles,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,   
        }
    };
  } catch (error) {
    throw new Error("Error changing user role: " + error.message);
  }
};

const banUser = async (userId) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await db.User.findByIdAndUpdate(
      userId,
      { status: "banned" },
      { new: true }
    );
    return {
        message: "User banned successfully",
        user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            roles: updatedUser.roles,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,   
        }
    };
  } catch (error) {
    throw new Error("Error banning user: " + error.message);
  }
};

const unbanUser = async (userId) => {
  try {
    const user = await db.User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await db.User.findByIdAndUpdate(
      userId,
      { status: "active" },
      { new: true }
    );
    return {
        message: "User unbanned successfully",
        user: {
            id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            roles: updatedUser.roles,
            status: updatedUser.status,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,   
        }
    };
  } catch (error) {
    throw new Error("Error unbanning user: " + error.message);
  }
};

const adminService = {
  addUser,
  changeUserRole,
  banUser,
  unbanUser,
};

module.exports = adminService;
