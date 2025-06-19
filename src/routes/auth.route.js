const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const {
  handleGoogleCallback,
} = require("../controllers/loginGoogle.controller");

const router = express.Router();

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);
router.delete("/logout", authController.logout);
router.put("/refresh_token", authController.refreshToken);
router.post("/resend-verification", authController.resendVerificationEmail);

// 👇 Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login?error=google_failed",
  }),
  handleGoogleCallback
);

module.exports = router;
