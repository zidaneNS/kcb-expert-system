const express = require('express');
const router = express.Router();
const {getAllDiseases, getAllSympthoms, addDisease} = require('../../controllers/sympthomController');

router.route('/')
    .get(getAllDiseases)
    .post(addDisease);

router.route('/sympthoms')
    .post(getAllSympthoms);

module.exports = router;