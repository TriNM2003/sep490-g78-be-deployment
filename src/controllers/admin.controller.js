const adminService = require('../services/admin.service');
const addUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = await adminService.addUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const roles = req.body.roles;
  try {
    const updatedUser = await adminService.changeUserRole(userId, roles);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const banUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await adminService.banUser(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unbanUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const updatedUser = await adminService.unbanUser(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminController = {
  addUser,
  changeUserRole,
  banUser,
  unbanUser,
};

module.exports = adminController;