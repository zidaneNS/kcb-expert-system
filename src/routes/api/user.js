const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../../controllers/userController');
const ROLES_LISTS = require('../../config/roles_lists');
const verifyRoles = require('../../middlewares/verifiyRoles');

router.get('/', verifyRoles(ROLES_LISTS.Dev), getAllUsers);
router.delete('/:id', verifyRoles(ROLES_LISTS.Dev), deleteUser);

module.exports = router;