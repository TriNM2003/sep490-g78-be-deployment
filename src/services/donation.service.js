const db = require("../models");

const saveDonation = async (donationData) => {
  try {
    const donation = await db.Donation.create({
      donor: donationData.donor || null,
      amount: donationData.amount,
      message: donationData.message,
    });
    if (!donation) {
      throw new Error("Failed to save donation");
    }
    const resultDonation = await db.Donation.findById(donation._id)
      .populate("donor", "fullName avatar");
    return resultDonation;
  } catch (error) {
    throw error;
  }
};

const getDonationsHistory = async (userId) => {
  try {
    const donations = await db.Donation.find({ donor: userId })
      .populate("donor", "fullName avatar")
      .sort({ createdAt: -1 });
    return donations;
  } catch (error) {
    throw error;
  }
};

const getAllDonations = async () => {
  try {
    const donations = await db.Donation.find()
      .populate("donor", "fullName avatar")
      .sort({ createdAt: -1 });
    return donations;
  } catch (error) {
    throw error;
  }
};

const donationService = {
  saveDonation,
  getDonationsHistory,
  getAllDonations,
};

module.exports = donationService;
