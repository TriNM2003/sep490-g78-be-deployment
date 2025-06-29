const shelterService = require("../services/shelter.service");

//USER
const getShelterRequestByUserId = async (req, res, next) => {
    try {
        const {id} = req.payload;
        const response = await shelterService.getShelterRequestByUserId(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const sendShelterEstablishmentRequest = async (req, res, next) => {
    try {
        const {id} = req.payload;
        const requestData = req.body;
        const response = await shelterService.sendShelterEstablishmentRequest(id, requestData, req.files);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const getShelterProfile = async (req, res, next) => {
  try {
        const {shelterId} = req.params;
        const response = await shelterService.getShelterProfile(shelterId);
        res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const editShelterProfile = async (req, res, next) => {
  try {
        const {shelterId} = req.params;
        const updatedData = {
            ...req.body,
            avatar: req.files?.avatar?.[0],
            background: req.files?.background?.[0],
        };
        const response = await shelterService.getShelterProfile(shelterId, updatedData);
        res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// ADMIN
const getAllShelter = async (req, res, next) => {
    try {
        const shelters = await shelterService.getAllShelter();
        res.status(200).json(shelters);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const getAllShelterEstablishmentRequests = async (req, res, next) => {
    try {
        const shelters = await shelterService.getAllShelterEstablishmentRequests();
        res.status(200).json(shelters);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const getOverviewStatistic = async (req, res, next) => {
    try {
        const overviewStatistics = await shelterService.getOverviewStatistic();
        res.status(200).json(overviewStatistics);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
const reviewShelterEstablishmentRequest = async (req, res, next) => {
    try {
        const {requestId, decision, rejectReason} = req.body;
        const response = await shelterService.reviewShelterEstablishmentRequest({requestId, decision, rejectReason});
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


const shelterController = {
    //USER
    sendShelterEstablishmentRequest,
    getShelterRequestByUserId,
    getShelterProfile,
    editShelterProfile,

    //ADMIN
    getAllShelter,
    getAllShelterEstablishmentRequests,
    getOverviewStatistic,
    reviewShelterEstablishmentRequest,
};

module.exports = shelterController;