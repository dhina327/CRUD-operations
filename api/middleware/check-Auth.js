const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Use 'authorization' instead of 'Authorization'
        const decoded = jwt.verify(token, "SECRET"); // Use jwt.verify to verify the token
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Auth Fail'
        });
    }
};
