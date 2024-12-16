const { users } = require("../models");
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/auth.config.js");
const { verifySignUp } = require("../middleware/verifySignUp.js");
const { verifyToken } = require("../middleware/auth");
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
exports.findUserById = async (req, res) => {
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
exports.findAll = () => {
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
  }).then((users) => {
    return users;
  });
};

// Actualizar usuarios
exports.updateUserById = (userId, fName, lName) => {
  return User.update(
    {
      firstName: fName,
      lastName: lName,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then((user) => {
      console.log(
        `>> Se ha actualizado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return user;
    })
    .catch((err) => {
      console.log(`>> Error mientras se actualizaba el usuario: ${err}`);
    });
};

// Actualizar usuarios
exports.deleteUserById = (userId) => {
  return User.destroy({
    where: {
      id: userId,
    },
  })
    .then((user) => {
      console.log(
        `>> Se ha eliminado el usuario: ${JSON.stringify(user, null, 4)}`
      );
      return user;
    })
    .catch((err) => {
      console.log(`>> Error mientras se eliminaba el usuario: ${err}`);
    });
};
