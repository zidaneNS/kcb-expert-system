const express = require('express');
const router = express.Router();
const { getAllDiseases, getAllSympthoms, addDisease, deleteDiseaseById, updateDiseaseById } = require('../../controllers/sympthomController');
const ROLES_LISTS = require('../../config/roles_lists');
const verifyRoles = require('../../middlewares/verifiyRoles');

router.route('/')
    .get(getAllDiseases)
    .post(verifyRoles(ROLES_LISTS.Expert, ROLES_LISTS.Dev), addDisease);

router.route('/sympthoms')
    .post(getAllSympthoms);

router.route('/:id')
    .delete(verifyRoles(ROLES_LISTS.Expert, ROLES_LISTS.Dev), deleteDiseaseById)
    .put(verifyRoles(ROLES_LISTS.Expert, ROLES_LISTS.Dev), updateDiseaseById);

module.exports = router;