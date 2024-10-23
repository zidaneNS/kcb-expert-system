const express = require('express');
const router = express.Router();
const {getAllDiseases, getAllSympthoms} = require('../../controllers/sympthomController');

router.route('/')
    .get(getAllDiseases);

router.route('/sympthoms')
    .post(getAllSympthoms);

module.exports = router;