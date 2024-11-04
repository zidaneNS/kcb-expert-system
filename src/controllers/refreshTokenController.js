const jwt = require('jsonwebtoken');
const User = require('../models/User');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    // if cookie empty
    if(!cookies?.jwt) return res.status(401).json({ success: false, message: 'unauthorized' });

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken: { $in: [refreshToken] } }).exec();
        
        // hacked handler
        if(!foundUser) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN,
                async (err, decoded) => {
                    if (err) return res.status(403).json({ success: false, message: 'invalid token' });
                    // const hackedUser = await User.findOne({ userName: decoded.userName }).exec();
                    // hackedUser.refreshToken = [];
                    // await hackedUser.save();
                }
            )

            return res.status(403).json({ success: false, message: 'forbidden founduser' });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN,
            async (err, decoded) => {
                const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);
                if (err) {
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    await foundUser.save();
                }
                if (err || foundUser.userName !== decoded.userName) return res.status(403).json({ success: false, message: "forbidden" });

                const roles = Object.values(foundUser.roles).filter(Boolean);
                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            userName: decoded.userName,
                            roles
                        }
                    },
                    process.env.ACCESS_TOKEN,
                    { expiresIn: '10s' }
                );
                const newRefreshToken = jwt.sign(
                    { userName: foundUser.userName },
                    process.env.REFRESH_TOKEN,
                    { expiresIn: '1d' }
                );
        
                foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                await foundUser.save();

                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true });
                res.status(201).json({ success: true, message: 'new accesstoken gained', data: { accessToken, roles } });
            }
        )
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = handleRefreshToken;