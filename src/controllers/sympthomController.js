const Sympthoms = require('../models/Sympthoms');

const getAllSympthoms = async (req, res) => {
    try {
        const results = await Sympthoms.find().exec();

        if (!results) return res.status(404).json({ success: false, message: 'not found' });
        console.log(results.length);
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: results});
    } catch (err) {
        console.error(err);
    }
}

module.exports = {getAllSympthoms};