const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

//Rutas para usuarios
router.post('/signup', userController.createUser)
router.post('/signin', userController.signinUser)

module.exports = router;