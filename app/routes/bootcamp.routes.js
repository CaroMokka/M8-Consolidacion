const express = require('express')
const router = express.Router()
const bootcampController = require("../controllers/bootcamp.controller.js")

//Rutas para bootcamps
router.post('/bootcamp', bootcampController.createBootcamp)

module.exports = router;