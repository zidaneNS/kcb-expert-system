const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const { userName, password } = req.body;

    if (!userName || !password) return res.status(400).json({ success: false, message: 'username or password required' });

    try {
        // get user with certain username
        const foundUser = await User.findOne({ userName }).exec();

        if (!foundUser) return res.status(404).json({ success: false, message: 'user not found' });

        // matching password
        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) return res.status(403).json({ success: false, message: 'password invalid' });

        // get the roles data from selected user
        const roles = Object.values(foundUser.roles).filter(Boolean);
        
        // define accesstoken
        const accessToken = jwt.sign(
            {
                userInfo: {
                    userName,
                    roles
                }
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: '15m' }
        );

        // define refreshtoken
        const newRefreshToken = jwt.sign(
            { userName },
            process.env.REFRESH_TOKEN,
            { expiresIn: '1d' }
        );

        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(token => token !== cookies.jwt);

        // if refreshtoken stolen
        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            if (!foundToken) {
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' });
        }

        // save current refreshToken
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

        await foundUser.save();

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24*60*60*1000 });

        res.status(200).json({ success: true, message: `user ${userName} logged in`, data: { accessToken, roles } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = handleLogin;