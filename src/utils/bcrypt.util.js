const bcrypt = require("bcrypt");


// salt: random text to password => more == stronger
// default: 10
const encryptPassword = async (password, saltNumber = 10) => {
    const salt = await bcrypt.genSalt(saltNumber);
    return bcrypt.hash(password, salt);
}

const comparePassword = async (encryptedPassword, password) => {
    return bcrypt.compare(encryptedPassword, password);
}

const bcryptUtils = {
    encryptPassword,
    comparePassword
}

module.exports = bcryptUtils;