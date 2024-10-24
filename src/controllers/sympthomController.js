const Sympthoms = require('../models/Sympthoms');

// getting all diseases with it sympthoms and treatments
const getAllDiseases = async (req, res) => {
    try {
        // get all diseases
        const results = await Sympthoms.find().exec();

        // if no results
        if (!results) return res.status(404).json({ success: false, message: 'not found' });
        
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: results});
    } catch (err) {
        // server error
        console.error(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
}

// getting all sympthoms
const getAllSympthoms  = async (req,  res) => {
    try {
        const { sympthomInput } = req.body;

        // getting all diseases with certain sympthoms
        const results = await Sympthoms.find({ sympthoms: { $all: sympthomInput } }).exec();

        // if no results
        if (!results) return res.status(404).json({ success: false, message: 'not found '});
        
        // if only 1 disease, the expert system is done and the result is the prediction of disease
        if (results.length === 1) return res.status(200).json({ success:true, message: 'only one disease', data: results[0] });

        // collecting all sympthoms from selected diseases
        const sympthomResult = results.map(result => result.sympthoms);

        // returning all sympthoms set
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: [...new Set(sympthomResult.flat())] });
    } catch (err) {
        // server error
        console.error(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
}

const addDisease = async (req, res) => {
    const { name, sympthoms, treatment } = req.body;
    if (!name || !sympthoms || !treatment) return res.status(400).json({ success: false, message: 'please complete the fields' });
    
    try {
    const duplicate = await Sympthoms.findOne({ name }).exec();
    if (duplicate) return res.status(409).json({ success: false, message: 'name already exist, choose modify if u want to change the only name' });

    const result = await Sympthoms.create({
        name,
        sympthoms,
        treatment
    });

    res.status(200).json({ success:true, message: 'success add disease', data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

const deleteDiseaseById = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(404).json({ success: false, message: 'id parameter required' });

    try {
        const foundDisease = await Sympthoms.findOne({ _id: id }).exec();
        if (!foundDisease) return res.status(404).json({ success: false, message: 'disease not found or id invalid' });
    
        const result = await Sympthoms.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: `disease ${foundDisease.name} deleted`, data: result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

const updateDiseaseById = async (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(404).json({ success: false, message: 'id parameter required' });

    const { name, sympthoms, treatment } = req.body;

    try {
        const foundDisease = await Sympthoms.findOne({ _id: id }).exec();
        if (!foundDisease) return res.status(404).json({ success: false, message: 'disease not found or id invalid' });

        foundDisease.name = name;
        foundDisease.sympthoms = sympthoms;
        foundDisease.treatment = treatment;

        const result = await foundUser.save();

        res.status(200).json({ success: true, message: `disease ${name} updated`, data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = { getAllDiseases, getAllSympthoms, addDisease, deleteDiseaseById, updateDiseaseById };