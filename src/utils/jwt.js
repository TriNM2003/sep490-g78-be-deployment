const JWT = require("jsonwebtoken");

const generateToken = (userInfo, secretSignature, tokenLife = "1h") => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      expiresIn: tokenLife,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

const verifyToken = (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
