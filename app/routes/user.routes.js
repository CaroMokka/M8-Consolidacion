const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller.js')

//Rutas para usuarios
router.post('/signup', userController.createUser)
router.post('/signin', userController.signinUser)
router.get('/user', userController.findAll)
router.get('/user/:id', userController.findUserByIdWithBootcamps)
router.delete('/user/:id', userController.deleteUserById)


module.exports = router;