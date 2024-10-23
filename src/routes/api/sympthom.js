const express = require('express');
const router = express.Router();
const {getAllSympthoms} = require('../../controllers/sympthomController');

router.route('/')
    .get(getAllSympthoms);

module.exports = router;