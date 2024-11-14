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

        // // if symthomInput empty / user just started the program then returning sympthoms that includes in every diseases
        if (sympthomInput.length < 1) {
            const results = await Sympthoms.find().exec();
            const sympthomFrequency = {};

            // fill key value object for sympthomFrequency
            results.forEach(result => {
                result.sympthoms.forEach(sympthom => {
                    if (!sympthomInput.includes(sympthom)) sympthomFrequency[sympthom] = (sympthomFrequency[sympthom] || 0) + 1;
                })
            })
    
            // defining array that contains set of total sympthomFrequency
            const freqArray = [...new Set(Object.values(sympthomFrequency).sort((a,b) => b-a ))];
    
            // the result is the sympthoms that appears half or greater in every diseases
            const sympthomResults = sympthomInput.includes('invalid') ? Object.keys(sympthomFrequency) : Object.keys(sympthomFrequency).filter(key => sympthomFrequency[key] >= freqArray[Math.floor(freqArray.length/2)]);
                
            //const sympthomResults = results.map(result => result.sympthoms)
            return res.json({ success: true, message: 'success retrieving all datas', data: sympthomResults });
        }

        // getting all diseases with inputed sympthoms
        const results = sympthomInput.includes('invalid') ? await Sympthoms.find().exec() : await Sympthoms.find({ sympthoms: { $all: sympthomInput } }).exec();

        // if no results
        if (!results) return res.status(404).json({ success: false, message: 'not found '});
        
        // if only 1 disease, the expert system is done and the result is the prediction of disease
        if (results.length === 1) return res.status(200).json({ success:true, message: 'only one disease', data: results[0] });

        // defining initial key value object to capture frequency of symthoms that appear in every diseases
        const sympthomFrequency = {};

        // fill key value object for sympthomFrequency
        results.forEach(result => {
            result.sympthoms.forEach(sympthom => {
                if (!sympthomInput.includes(sympthom)) sympthomFrequency[sympthom] = (sympthomFrequency[sympthom] || 0) + 1;
            })
        })

        // defining array that contains set of total sympthomFrequency
        const freqArray = [...new Set(Object.values(sympthomFrequency).sort((a,b) => b-a ))];

        // the result is the sympthoms that appears half or greater in every diseases
        const sympthomResult = sympthomInput.includes('invalid') ? Object.keys(sympthomFrequency) : Object.keys(sympthomFrequency).filter(key => sympthomFrequency[key] >= freqArray[Math.floor(freqArray.length/2)]);

        // returning all sympthoms set
        res.status(200).json({ success: true, message: 'success retrieving all datas', data: sympthomResult });
    } catch (err) {
        // server error
        console.error(err);
        res.status(500).json({ success: false, message: 'server error' });
    }
}

const addDisease = async (req, res) => {
    const { name, cautions, description, sympthoms, treatment } = req.body;
    if (!name || !cautions || !description || !sympthoms || !treatment) return res.status(400).json({ success: false, message: 'please complete the fields' });
    
    try {
        const duplicate = await Sympthoms.findOne({ name }).exec();
    if (duplicate) return res.status(409).json({ success: false, message: 'name already exist, choose modify if u want to change the only name' });

    const result = await Sympthoms.create({
        name,
        description,
        cautions,
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

    const { name, description, cautions, sympthoms, treatment } = req.body;

    try {
        const foundDisease = await Sympthoms.findOne({ _id: id }).exec();
        if (!foundDisease) return res.status(404).json({ success: false, message: 'disease not found or id invalid' });

        foundDisease.name = name;
        foundDisease.description = description;
        foundDisease.cautions = cautions;
        foundDisease.sympthoms = sympthoms;
        foundDisease.treatment = treatment;

        const result = await foundDisease.save();

        res.status(200).json({ success: true, message: `disease ${name} updated`, data: result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'server error' });
    }
}

module.exports = { getAllDiseases, getAllSympthoms, addDisease, deleteDiseaseById, updateDiseaseById };