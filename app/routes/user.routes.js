const express = require('express')
const router = express.Router()

//Rutas para usuario
router.post('/api/signup', (req, res) => {
    //.send('Crear un usuario');
    console.log('Crear un usuario')
})

module.exports = router;