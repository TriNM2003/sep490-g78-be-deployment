const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.payload.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const result = await userService.changePassword(
      req.payload.id,
      oldPassword,
      newPassword,
      confirmPassword
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    // console.log("Req body:", req.body);
    // console.log("Req files:", req.files);
    const profileData = req.body;
    const result = await userService.editProfile(
      req.payload.id,
      profileData,
      req.files
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in editProfile:", error.message);
    res.status(400).json({ message: error.message });
  }
};


// ADMIN
const getUsersList = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    const formattedOutput = users.map(user => {
      return {
        _id: user._id,
      avatar: user.avatar,
      fullName: user.fullName || null,
      email: user.email,
      roles: user.roles,
      status: user.status,
      phoneNumber: user.phoneNumber,
      warningCount: user.warningCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }})
    res.status(200).json({
      status: 200,
      usersList: formattedOutput
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const userController = {
  getAllUsers,
  getUserById,
  changePassword,
  editProfile,

  //ADMIN
  getUsersList,
};

module.exports = userController;
