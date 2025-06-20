const {redisClient} = require("../configs/")

// expTime tinh bang giay
const setRefreshToken = async (userId, refeshToken, expTime) => {
    await redisClient.set(`refreshToken:${userId}`, refeshToken, "EX",  expTime);
    console.log("Create user refresh token and add to Redis successfully!")
}

const getRefreshToken = async (userId) => {
    return await redisClient.get(`refreshToken:${userId}`);
}

const deleteRefreshToken = async (userId) => {
    await redisClient.del(`refreshToken:${userId}`);
    console.log("Delete user refresh token from Redis successfully!")
}

const redisUtils = {
    setRefreshToken,
    getRefreshToken,
    deleteRefreshToken,
}

module.exports = redisUtils