const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    const { userName, password, roles } = req.body;

    if (!userName || !password) return res.status(400).json({ success: false, message: 'username or password required' });

    try {
        const duplicate = await User.findOne({ userName }).exec();
        if (duplicate) return res.status(409).json({ success: false, message: 'username already existed' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = !roles ? await User.create({
            userName,
            password: hashedPassword,
        }) : await User.create({
            userName,
            password: hashedPassword,
            roles
        });

        res.status(200).json({ success: true, message: `user ${userName} created`, data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }

}

module.exports = handleRegister;