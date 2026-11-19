const { DecodeToken } = require("../utility/tokenHelper.js");

module.exports = (req, res, next) => {
    const token = req.cookies.a_token;
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const decoded = DecodeToken(token);
    if (!decoded) {
        res.status(401).json({
            status: 401,
            message: "Invalid token!"
        });
    }
    req.headers.email = decoded.email;
    req.headers._id = decoded._id;
    next();
};