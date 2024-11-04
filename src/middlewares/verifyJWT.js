const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'unauthorized' });
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            if (err) return res.status(403).json({ success: false, message: 'forbidden' });
            req.user = decoded.userInfo.userName;
            req.roles = decoded.userInfo.roles;
            next();
        }
    );
}

module.exports = verifyJWT;