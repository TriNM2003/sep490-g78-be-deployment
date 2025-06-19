const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const ms = require("ms");
const jwt = require("../utils/jwt");
const ACCESSTOKEN = process.env.ACCESS_TOKEN;
const REFRESHTOKEN = process.env.REFRESH_TOKEN;
const { sendVerificationEmail } = require("../utils/mailer");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Dữ liệu gửi lên:", req.body); // thêm để kiểm tra

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại." });

    const hash = await bcrypt.hash(password, 10);
    const verificationToken = await jwt.generateToken(
      { email },
      ACCESSTOKEN,
      "1d"
    );

    const newUser = new User({
      username,
      email,
      password: hash,
      roles: ["user"],
      status: "verifying",
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực.",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error("Đăng ký lỗi:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi khi đăng ký tài khoản." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({ message: "Email not found" });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });
    if (existingUser.status !== "active") {
      return res
        .status(403)
        .json({ message: "Tài khoản chưa được xác thực email." });
    }

    const accessToken = await jwt.generateToken(
      {
        _id: existingUser._id,
        email: existingUser.email,
        roles: existingUser.roles,
      },
      ACCESSTOKEN,
      "1h"
    );
    const refreshToken = await jwt.generateToken(
      {
        _id: existingUser._id,
        email: existingUser.email,
        roles: existingUser.roles,
      },
      REFRESHTOKEN,
      "14 days"
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      users: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        roles: existingUser.roles,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenFromCookies = req.cookies?.refreshToken;
    const refreshTokenDecoded = await jwt.verifyToken(
      refreshTokenFromCookies,
      REFRESHTOKEN
    );

    const accessToken = await jwt.generateToken(
      {
        _id: refreshTokenDecoded._id,
        email: refreshTokenDecoded.email,
        roles: refreshTokenDecoded.roles,
      },
      ACCESSTOKEN,
      "1h"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(500).json("Refresh token fail");
  }
};
// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.query;
//     const decoded = await jwt.verifyToken(token, ACCESSTOKEN);
//     const user = await User.findOne({ email: decoded.email });

//     if (!user) return res.status(404).json({ message: "User not found" });
//     if (user.status === "active")
//       return res.status(400).json({ message: "Already verified" });

//     user.status = "active";
//     await user.save();

//     res.status(200).json({ message: "Email verified successfully!" });
//   } catch (err) {
//     res.status(400).json({ message: "Invalid or expired token" });
//   }
// };
// const resendVerificationEmail = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) return res.status(400).json({ message: "Email is required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.status === "active") {
//       return res.status(400).json({ message: "Tài khoản đã xác thực." });
//     }

//     const token = await jwt.generateToken(
//       { email: user.email },
//       process.env.ACCESS_TOKEN,
//       "1d"
//     );

//     await sendVerificationEmail(user.email, token);

//     return res.status(200).json({ message: "Đã gửi lại email xác thực." });
//   } catch (err) {
//     console.error("Resend verification error:", err);
//     return res.status(500).json({ message: "Gửi lại email thất bại." });
//   }
// };

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  // verifyEmail,
  // resendVerificationEmail,
};
