const User = require("../models/user.model");
const jwt = require("../utils/jwt");

const handleGoogleCallback = async (req, res) => {
  try {
    const googleProfile = req.user;

    // 🔍 Tìm user trong database theo email Google
    let user = await User.findOne({ email: googleProfile.email });

    // ✅ Nếu chưa có thì tạo mới user
    if (!user) {
      user = new User({
        username: googleProfile.name || googleProfile.email.split("@")[0],
        email: googleProfile.email,
        roles: ["user"],
        status: "active", // 👈 Tự động active luôn
        googleId: googleProfile.id, // nếu bạn muốn lưu ID của Google
      });
      await user.save();
    }

    // ✅ Nếu đã có nhưng chưa active, thì cũng cho login luôn
    if (user.status !== "active") {
      user.status = "active";
      await user.save();
    }

    const accessToken = await jwt.generateToken(
      {
        _id: user._id,
        email: user.email,
        roles: user.roles,
      },
      process.env.ACCESS_TOKEN,
      "1h"
    );

    const userInfo = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        email: user.email,
        username: user.username,
        roles: user.roles,
      })
    );

    return res.redirect(
      `http://localhost:5173/login?googleToken=${accessToken}&userInfo=${userInfo}`
    );
  } catch (error) {
    console.error("Google login error:", error);
    return res.redirect("http://localhost:5173/login?error=google_failed");
  }
};

module.exports = {
  handleGoogleCallback,
};
