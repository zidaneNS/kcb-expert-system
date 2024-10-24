const express = require('express');
const router = express.Router();
const { getAllDiseases, getAllSympthoms, addDisease, deleteDiseaseById, updateDiseaseById } = require('../../controllers/sympthomController');

router.route('/')
    .get(getAllDiseases)
    .post(addDisease);

router.route('/sympthoms')
    .post(getAllSympthoms);

router.route('/sympthoms/:id')
    .delete(deleteDiseaseById)
    .put(updateDiseaseById);

module.exports = router;