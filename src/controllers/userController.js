const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const foundUsers = await User.find().exec();
        const result = foundUsers.filter(user => !user.roles.Expert && !user.roles.Dev);
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

// test

const deleteUser = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ success: false, message: 'id param required' });
    const id = req.params.id;

    try {
        const foundUser = await User.find({ _id: id }).exec();
        if (!foundUser) return res.status(404).json({ success:false, message: 'user not found or id invalid' });

        const result = await User.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: `user with id ${id} deleted`, data: result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = { getAllUsers, deleteUser };