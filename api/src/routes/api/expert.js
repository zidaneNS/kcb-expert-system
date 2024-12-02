const express = require('express');
const router = express.Router();
const { getAllExperts, deleteExpert } = require('../../controllers/expertController');
const ROLES_LISTS = require('../../config/roles_lists');
const verifyRoles = require('../../middlewares/verifiyRoles');

router.get('/', verifyRoles(ROLES_LISTS.Dev), getAllExperts);
router.delete('/:id', verifyRoles(ROLES_LISTS.Dev), deleteExpert);


module.exports = router;