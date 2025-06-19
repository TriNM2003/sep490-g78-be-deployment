const express = require("express");
const authRouter = require("./auth.route");

const router = express.Router();

router.use("/auth", authRouter); // chỉ mount một lần

module.exports = router;
