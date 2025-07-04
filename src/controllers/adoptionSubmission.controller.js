const adoptionSubmissionService = require('../services/adoptionSubmission.service');

const getAdtoptionRequestList = async (req, res) => {
    try {
        const adoptionRequests = await adoptionSubmissionService.getAdtoptionRequestList(req.payload.id);
        res.status(200).json(adoptionRequests);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const adoptionSubmissionController = {
    getAdtoptionRequestList,
};

module.exports = adoptionSubmissionController;