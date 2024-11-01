const User = require('../models/User');
const jwt = require('jsonwebtoken');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(204).json({ success: true, message: 'no content' });
    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();

        // if no user
        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
            return res.status(204).json({ success: true, message: 'no user' });
        }

        foundUser.refreshToken = foundUser.refreshToken.filter(token => token !== refreshToken);
        const result = await foundUser.save();

        res.clearCookie('jwt', { httpOnly:true, sameSite: 'None', secure: true });
        res.status(204).json({ success: true, message: 'user loged out' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = handleLogout;