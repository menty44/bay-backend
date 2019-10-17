const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users');

//public routes
router.post('/register', userController.create);
router.post('/authenticate', userController.authenticate);

//private routes
router.get('/profiles', userController.getAll);
router.post('/patch', userController.doPatch);
router.get('/thumbnail', userController.generate);


module.exports = router;