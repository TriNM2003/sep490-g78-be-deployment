
const jwt = require("jsonwebtoken");
const {User} = require("../models/");
const {bcryptUtils, jwtUtils, redisUtils} = require("../utils")
require("../middlewares/auth.middleware");


const register = async (req) => {
    const { fullName, email, password} = req.body;
    // console.log(req.body)
    const isEmailExisted = await User.findOne({email: email});
    if (isEmailExisted) {
        return {
            status: 400,
            message: "Email  đã tồn tại!"
        };
    }
    const hashedPassword = await bcryptUtils.encryptPassword(password, 10);
    const newUser = new User({
          email,
        password: hashedPassword,
        fullName: fullName,
        phoneNumber: null,
        address: null,
        roles: ["user"],
        avatar: "https://res.cloudinary.com/dpaht6o2y/image/upload/v1753883950/1aa8d75f3498784bcd2617b3e3d1e0c4_fvgwde.jpg",
        bio: null,
        background: "https://res.cloudinary.com/dpaht6o2y/image/upload/v1753884093/2746ae1e9f480a1a5c459355340449aa_zmqvf0.jpg",
        warningCount: 0,
        teams: [],
        googleId: null,
        status: "verifying",
    });
    await newUser.save();
    const activeToken = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )
    return {
        status: 200,
        message: "Đăng kí thành công!",
        account: newUser,
        activeToken: activeToken
     };
};


const login = async (email, password, type) => {
  const user = await User.findOne({ email: email });

  // console.log(usernameOrEmail, password)
  if (!user) {
    return {
      status: 400,
      message: "Email không tồn tại!",
    };
  }

  // check co phai account dk bang google
  if (user.googleId !== null) {
    return {
      status: 400,
      message:
        "Tài khoản đã đăng kí bằng Google! Làm ơn hãy đăng nhập bằng Google",
    };
  }

  const isMatch = await bcryptUtils.comparePassword(password, user.password);
  // console.log(isMatch)
  if (!isMatch) {
    return {
      status: 400,
      message: "Sai mật khẩu!",
    };
  }

  const validRole = user.roles.includes(type);
  if (!validRole) {
    return {
      status: 400,
      message: "Tài khoản không có quyền đăng nhập hệ thống!",
    };
  }


  // Nếu tài khoản chưa kích hoạt, gửi token về FE để kích hoạt
  if (user.status === "verifying") {
    const activeToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    return {
      status: 403,
      message: "Tài khoản chưa kích hoạt!...",
      activeToken,
    };
  }
  if (user.status === "banned") {
    return {
      status: 400,
      message: "Tài khoản đã bị khóa!",
    };
  }

  // accessToken
  const accessToken = jwtUtils.generateAccessToken(user._id);
  // refresh token
  const refreshToken = jwtUtils.generateRefreshToken(user._id);
  // luu vao trong redis
  await redisUtils.setRefreshToken(
    user._id,
    refreshToken,
    jwtUtils.refreshTokenExp
  );
  return {
    status: 200,
    message: "Đăng nhập thành công!",
    accessToken: accessToken,
    user: {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      roles: user.roles,
      status: user.status,
    },
  };
};


const logout = async (userId) => {
    await redisUtils.deleteRefreshToken(userId);
    return {
        status: 200,
        message: "Thoát đăng nhập thành công!"
    };
}


const getRefreshToken = async (userId) => {
    const refreshToken = await redisUtils.getRefreshToken(userId);
    if (!refreshToken) {
        throw new Error("Refresh token not found!");
    }
    return refreshToken;
}

const getUserByAccessToken = async (accessToken) => {
    //decode access Token
    const decodedAccessToken = jwtUtils.decode(accessToken);

    // get user
    const user = await User.findById(decodedAccessToken.id).populate("roles");

    // Nếu tài khoản chưa kích hoạt, gửi token về FE để kích hoạt
  if (user.status === "verifying") {
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
    const error = new Error("Account not activated! Redirecting to activation page...");
    error.status = 403; 
    error.token = token;
    throw error;

    }
    return user;
}

const refreshAccessToken = async (req, res) => {
    // lay refresh token va user id
    const { refreshToken, id} = req.body;
    const user = await User.findById(id);

    // Xác thực refreshToken
    // console.log(refreshToken);
    const isValid = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    if (!isValid) {
        throw new Error("Refresh token is invalid!");
    }

    // Tạo accessToken mới
    const accessToken = jwtUtils.generateAccessToken(user._id);

    return {
        message: "Refresh access token successfully!",
        accessToken: accessToken,
    };
};



const authService = {
    login,
    register,
    getUserByAccessToken,
    getRefreshToken,
    refreshAccessToken,logout,
}

module.exports = authService;