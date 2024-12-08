const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

//Rutas para usuarios
router.post('/signup', userController.createUser)

module.exports = router;