const { User } = require("../models");


const isAdmin = async (req, res, next) => {
    try {
        const { id } = req.payload;
        const user = await User.findOne({ _id: id});
        // console.log(user)
        if(!user.roles.includes('admin')) {
            return res.status(401).json({ error: { status: 401, message: "Không phải là quản trị viên! Chặn quyền truy cập tài nguyên" }});
        }
        next();
    } catch (error) {
        next(error)
    }
};

const adminhMiddleware = {
    isAdmin,
}

module.exports = adminhMiddleware;

