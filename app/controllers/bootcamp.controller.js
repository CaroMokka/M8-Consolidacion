const { users, bootcamps } = require("../models");
const db = require("../models");
const secretKey = require("../config/auth.config.js");
const { verifyToken } = require("../middleware/auth.js");
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  const { title, cue, description } = req.body;
  if (!title || !cue || !description) {
    return { message: "Los campos son requeridos y no vacíos", code: 400 };
  }
  const codedtoken = req.headers.authorization;
  const tokenValid = verifyToken(codedtoken, secretKey);

  if (!tokenValid.data) {
    res.status(tokenValid.code).json({ data: tokenValid });
  }
  return Bootcamp.create({
    title: title,
    cue: cue,
    description: description,
  })
    .then((bootcamp) => {
      console.log(
        `>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`
      );
      res
        .status(200)
        .json({ message: "El registro de bootcamp ha sido exitoso", bootcamp });
    })
    .catch((err) => {
      console.log(`>> Error al crear el bootcamp: ${err}`);
    });
};

// Agregar un Usuario al Bootcamp
exports.addUser = async (req, res) => {
  const bootcampId = req.params.id;
  const codedToken = req.headers.authorization;
  if (!codedToken) {
    return res.status(401).json({
      message:
        "No autorizado para agregar usuario a Bootcamp. Debe enviar token de acceso.",
    });
  }
  const tokenValid = verifyToken(codedToken, secretKey);
  const userId = tokenValid.data.id;
  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        res.status(404).json({ message: "Bootcamp no encontrado!" })
        return null;
      }
      return User.findByPk(userId).then((user) => {
        if (!user) {
          res.status(404).json({ message: "Usuario no encontrado!" })
          return null;
        }
        bootcamp.addUser(user);
        res.status(200).json({ message: `Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`, bootcamp: bootcamp})
      });
    })
    .catch((err) => {
      console.log(
        ">> Error mientras se estaba agregando Usuario al Bootcamp",
        err
      );
    });
};

// obtener los bootcamp por id
exports.findByIdWithUsers = async (req, res) => {
  const { id } = req.params
  const token = req.headers.authorization
  const isToken = await verifyToken(token, secretKey)
  if(!isToken.data){
    return res.status(isToken.code).json({ message: isToken.message})
  }
  
  const bootcamp = await Bootcamp.findByPk(id, {
    include : [
      {
        model: User,
        as: "users",
        attributes: [ "id", "firstName", "lastName" ],
        through: {
          attributes: []
        }
      }
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
  return res.status(200).json({ message: "Bootcamp encontrado con exito", data: bootcamp })
};

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = () => {
  return Bootcamp.findAll({
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        },
      },
    ],
  })
    .then((bootcamps) => {
      return bootcamps;
    })
    .catch((err) => {
      console.log(">> Error Buscando los Bootcamps: ", err);
    });
};

//Listar todos los bootcamps
exports.findAllBootcamps = (req, res) => {
  return Bootcamp.findAll({
    include: [
      {
        model: User,
        as: "users",
        attributes: [ "id", "firstName", "lastName" ]
      }
    ]
  })
  .then((bootcamps) => { 
    res.json({ message: "Listado de bootcamps", data: bootcamps })
  })
  .catch((err) => {
    return console.log(`Hubo un error en la consulta ${err}`)
  })
}
