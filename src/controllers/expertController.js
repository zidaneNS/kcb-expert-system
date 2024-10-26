const User = require('../models/User');

const getAllExperts = async (req, res) => {
    try {
        const result = await User.find({ "roles.Expert": 2002 }).exec();
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

const deleteExpert = async (req, res) => {
    if (!req.params?.id) return res.status(400).json({ success: false, message: 'id param required' });
    const id = req.params.id;

    try {
        const foundUser = await User.find({ _id: id }).exec();
        if (!foundUser) return res.status(404).json({ success:false, message: 'user not found or id invalid' });

        const result = await User.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: `expert with id ${id} deleted`, data: result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = { getAllExperts, deleteExpert };