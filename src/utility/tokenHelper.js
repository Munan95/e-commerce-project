const jwt = require("jsonwebtoken");

exports.EncodeToken = (email, _id) => {
    let key = process.env.JWT_TOKEN;
    let expire = process.env.JWT_EXPIRE_TIME;
    let payload = { email, _id }
    return jwt.sign(payload, key, { expiresIn: expire });
};

exports.DecodeToken = (token) => {
    try {
        let key = process.env.JWT_TOKEN;
        let decoded = jwt.verify(token, key);
        return decoded;
    } catch (error) {
        return null;
    }
};