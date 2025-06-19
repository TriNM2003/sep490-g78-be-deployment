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
    const user = await userService.getUserById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const result = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      dob: user.dob,
      phoneNumber: user.phoneNumber,
      address: user.address,
      background: user.background,
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    const result = await userService.changePassword(
      req.params.userId,
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
      req.params.userId,
      profileData,
      req.files
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in editProfile:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const userController = {
  getAllUsers,
  getUserById,
  changePassword,
  editProfile,
};

module.exports = userController;
