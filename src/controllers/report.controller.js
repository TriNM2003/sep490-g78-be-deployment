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
const getAllReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
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
  getAllReports,
    
};

module.exports = reportController;