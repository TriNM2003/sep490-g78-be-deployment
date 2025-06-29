const express = require("express");
const petRouter = express.Router();
const bodyParser = require("body-parser");
const { verifyAccessToken } = require("../middlewares/auth.middleware");
const petController = require("../controllers/pet.controller");
const upload = require("../middlewares/upload.middleware");

petRouter.use(bodyParser.json());
petRouter.get("/get-pet-list", petController.getPetList);
petRouter.get("/:petId/medicalRecords", petController.getMedicalRecords);
petRouter.get("/getAllPets", petController.getAllPets);
petRouter.get("/:petId", petController.viewDetailPet);
petRouter.post("/createPet", petController.createPet);
petRouter.put("/updatePet/:id", petController.updatePet);
petRouter.delete("/deletePet/:id", petController.deletePet);
petRouter.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  // Trả về đường dẫn local
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});


petRouter.get("/get-by-id/:petId", petController.getPetById);
petRouter.get("/get-adopted-by-user/:userId", petController.getAdoptedPetbyUser);
module.exports = petRouter;
