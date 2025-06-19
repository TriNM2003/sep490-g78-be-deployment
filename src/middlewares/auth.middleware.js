const jwt = require("../utils/jwt");

const isAuthorized = (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  console.log("Access Token:", accessToken);

  if (!accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const accessTokenDecoded = jwt.verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN
    );
    req.jwtDecoded = accessTokenDecoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    if (error.message?.includes("jwt expired")) {
      return res.status(410).json({ error: "Need to refresh Token" });
    }
    return res.status(401).json({ error: "Unauthorized! Please Login" });
  }
};

export const authMiddleware = {
  isAuthorized,
};
