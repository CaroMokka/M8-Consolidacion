const { users } = require("../models");
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/auth.config.js");
const { verifySignUp } = require("../middleware/verifySignUp.js");
const { verifyToken } = require("../middleware/auth");
const privateKey = require("../config/auth.config.js");
const User = db.users;
const Bootcamp = db.bootcamps;

// Crear y Guardar Usuarios
exports.createUser = (req, res) => {
  const saltRounds = 10;
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    return res
      .status(400)
      .json({ message: "Los campos son requeridos y no vacíos" });
  }
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
  };
  return User.create({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password: user.password,
  })
    .then((user) => {
      console.log(
        `>> Se ha creado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return res
        .status(201)
        .json({ message: "El registro de usuario ha sido exitoso", user });
    })
    .catch((err) => {
      console.log(`>> Error al crear el usuario ${err}`);
    });
};

//Login de usuarios
exports.signinUser = async (req, res) => {
  const user = await verifySignUp(req.body);
  if (!user.data) {
    return res.status(user.code).json({ message: user.message });
  }
  const decodedToken = jwt.sign(user, secretKey);
  return res.status(user.code).json({ data: decodedToken });
};

// obtener los bootcamp de un usuario
exports.findUserByIdWithBootcamps = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization;
    const isToken = await verifyToken(token, secretKey);
    if (!isToken.data) {
      return res.status(isToken.code).json({ message: isToken.message });
    }

    const user = await User.findByPk(id, {
      include: [
        {
          model: Bootcamp,
          as: "bootcamps",
          attributes: ["id", "title"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const { password: pswd, ..._user } = user.dataValues;
    if (!_user) {
      return res
        .status(404)
        .json({
          message: "Id de usuario no se encuentra en nuestros registros.",
        });
    }
    return res
      .status(200)
      .json({
        message: "Usuario encontrado con sus respectivos bootcamps.",
        data: _user,
      });
  } catch (err) {
    console.log(`>> Error mientras se encontraba los usuarios: ${err}`);
  }
};

// obtener todos los Usuarios incluyendo los bootcamp
exports.findAll = async (req, res) => {
  const token = req.headers.authorization
  const isToken = await verifyToken(token, secretKey)
  if(!isToken.data){
    return res.status(isToken.code).json({ message: isToken.message })
  }
  return User.findAll({
    include: [
      {
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: {
          attributes: [],
        },
      },
    ],
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    }
  }).then((users) => {
    return res.status(200).json({ message: "Lista de usuarios registrados con sus respectivos bootcamps", data: users })
  })
  .catch((err)=>{return err.message})
};

// Actualizar usuarios
exports.updateUserById = async (req, res) => {
  try{
    const { id } = req.params
    const { firstName, lastName, email } = req.body
    const token = req.headers.authorization
    const isToken = await verifyToken(token, secretKey)
    if(!isToken.data){
      return res.status(isToken.code).json({ message: isToken.message })
    }
    const isUser = await User.findByPk(id, {
      attributes: {
        exclude: [ "createdAt", "updatedAt", "password"]
      }
    })

    if(!isUser){
        return res.status(404).json({ message: "Usuario no encontrado." })
    }
    await isUser.update({ firstName, lastName, email })
    return res.status(200).json({ message: "Usuario actualizado correctamente.", data: isUser })
  }
  catch(err){
    console.error('Error al actualizar el usuario:', err.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar usuarios
exports.deleteUserById = async (req, res) => {
  try{
    const userId = req.params.id
    const token = req.headers.authorization
    const isToken = await verifyToken(token, secretKey)
    if(!isToken.data){
      return res.status(isToken.code).json({ message: isToken.message })
    }
    const userDeleted = await User.findByPk(userId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    })
    if(!userDeleted){
      return res.status(404).json({ message: "Usuario no encontrado" })
    }
    await userDeleted.destroy()

    res.status(200).json({ message: "Se ha eliminnado el usuario", data: userDeleted.dataValues })
  }
  catch(err){
    console.log(`>> Error mientras se eliminaba el usuario: ${err}`)
  }
};
