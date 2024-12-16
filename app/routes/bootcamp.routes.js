const express = require('express')
const router = express.Router()
const bootcampController = require("../controllers/bootcamp.controller.js")

//Rutas para bootcamps
router.post('/bootcamp', bootcampController.createBootcamp)
router.post('/bootcamp/:id', bootcampController.addUser)
router.get('/bootcamp', bootcampController.findAllBootcamps)
router.get('/bootcamp/:id', bootcampController.findByIdWithUsers)

module.exports = router;