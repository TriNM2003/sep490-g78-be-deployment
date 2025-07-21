const reportService = require("../services/report.service");

//USER
const reportUserById = async (req, res) => {
  try {
    const {id} = req.payload;
    const response = await reportService.reportUser(id, req.body, req.files)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const reportPostById = async (req, res) => {
  try {
    const {id} = req.payload;
    const response = await reportService.reportPost(id, req.body, req.files)
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


//ADMIN
const getUserReports = async (req, res) => {
  try {
    const reports = await reportService.getUserReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getPendingUserReports = async (req, res) => {
  try {
    const reports = await reportService.getPendingUserReports();
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const reportController = {
  //USER
  reportUserById,
  reportPostById,

  //ADMIN
  getUserReports,
  getPendingUserReports,
    
};

module.exports = reportController;