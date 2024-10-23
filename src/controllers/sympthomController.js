const Sympthoms = require('../models/Sympthoms');

const getAllDiseases = async (req, res) => {
    try {
        const results = await Sympthoms.find().exec();

        if (!results) return res.status(404).json({ success: false, message: 'not found' });
        console.log(results.length);
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: results});
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
}

const getAllSympthoms  = async (req,  res) => {
    try {
        const {sympthomInput} = req.body;

        const results = await Sympthoms.find({ sympthoms: { $all: sympthomInput } }).exec();

        if (!results) return res.status(404).json({ success: false, message: 'not found '});
        const sympthomResult = results.map(result => result.sympthoms);

        if (results.length === 1) return res.status(200).json({ success:true, message: 'only one disease', data: results[0] });
        
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: [...new Set(sympthomResult.flat())] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = {getAllDiseases, getAllSympthoms};