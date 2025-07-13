const express = require ("express");
const donationRouter = express.Router();
const bodyParser = require("body-parser");
const {verifyAccessToken} = require("../middlewares/auth.middleware");

const { donationController } = require("../controllers");
donationRouter.use(bodyParser.json());

donationRouter.post("/save-donation", donationController.saveDonation);
donationRouter.get("/get-donations-history", verifyAccessToken, donationController.getDonationsHistory);
donationRouter.get("/get-all-donations", verifyAccessToken, donationController.getAllDonations);

module.exports = donationRouter;