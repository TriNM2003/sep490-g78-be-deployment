const shelterService = require("../services/shelter.service");

//USER
const sendShelterEstablishmentRequest = async (req, res, next) => {
    try {
        // const {id} = req.payload;
        const requestData = req.body;
        const response = await shelterService.sendShelterEstablishmentRequest("68539dfbe4f6f8782aab85f1", requestData, req.files);
        res.status(200).json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


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


const shelterController = {
    //USER
    sendShelterEstablishmentRequest,

    //ADMIN
    getAllShelter,
    getAllShelterEstablishmentRequests,
    getOverviewStatistic,
};

module.exports = shelterController;