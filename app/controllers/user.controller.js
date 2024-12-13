const {
  users
} = require('../models')
const db = require('../models')
const bcrypt = require('bcrypt');
const { jwt } = require('jsonwebtoken')
const { secretKey } = require('../config/auth.config.js')
const { verifyToken } = require('../middleware/auth.js')
const User = db.users
const Bootcamp = db.bootcamps

// Crear y Guardar Usuarios
exports.createUser = (req, res) => {
  const saltRounds = 10;
  if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password){
    return res.status(400).json({ message: "Los campos son requeridos y no vacíos" })
  }
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds)
  }
  return User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    })
    .then(user => {
      console.log(`>> Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`)
      return res.status(200).json({ message: "El registro de usuario ha sido exitoso", user })
    })
    .catch(err => {
      console.log(`>> Error al crear el usuario ${err}`)
    })
}

//Login de usuarios
exports.signinUser = async (req, res) => {
  const user = await verifyToken(req.body)
  if(!user.data){
    return res.status(user.code).json({ message: user.message });
  }
 
  // const decodedToken = jwt.sign(user, secretKey)
  return res.status(user.code).json({ data: user });
}

// obtener los bootcamp de un usuario
exports.findUserById = (userId) => {
  return User.findByPk(userId, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(users => {
      return users
    })
    .catch(err => {
      console.log(`>> Error mientras se encontraba los usuarios: ${err}`)
    })
}

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = () => {
  return User.findAll({
    include: [{
      model: Bootcamp,
      as: "bootcamps",
      attributes: ["id", "title"],
      through: {
        attributes: [],
      }
    }, ],
  }).then(users => {
    return users
  })
}

// Actualizar usuarios
exports.updateUserById = (userId, fName, lName) => {
  return User.update({
      firstName: fName,
      lastName: lName
    }, {
      where: {
        id: userId
      }
    })
    .then(user => {
      console.log(`>> Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`)
      return user
    })
    .catch(err => {
      console.log(`>> Error mientras se actualizaba el usuario: ${err}`)
    })
}

// Actualizar usuarios
exports.deleteUserById = (userId) => {
  return User.destroy({
      where: {
        id: userId
      }
    })
    .then(user => {
      console.log(`>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`)
      return user
    })
    .catch(err => {
      console.log(`>> Error mientras se eliminaba el usuario: ${err}`)
    })
}