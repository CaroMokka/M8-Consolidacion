const {
  users,
  bootcamps
} = require('../models')
const db = require('../models')
const secretKey = require('../config/auth.config.js')
const { verifyToken } = require('../middleware/auth.js')
const Bootcamp = db.bootcamps
const User = db.users

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = (req, res) => {
  const { title, cue, description } = req.body
  if(!title || !cue || !description){
    return { message: "Los campos son requeridos y no vacíos", code: 400}
  }
  const codedtoken = req.headers.authorization
  const tokenValid = verifyToken(codedtoken, secretKey)
  console.log("token valido",tokenValid)

  if(!tokenValid.data){
   res.status(tokenValid.code).json({ data: tokenValid })
  }
  return Bootcamp.create({
    title: title,
    cue: cue,
    description: description,
  })
  .then(bootcamp => {
    console.log(`>> Creado el bootcamp: ${JSON.stringify(bootcamp, null, 4)}`)
    res.status(200).json({ message: "El registro de bootcamp ha sido exitoso", bootcamp })
  })
  .catch(err => {
    console.log(`>> Error al crear el bootcamp: ${err}`)
  })
}

// Agregar un Usuario al Bootcamp
exports.addUser = (bootcampId, userId) => {
  return Bootcamp.findByPk(bootcampId)
    .then((bootcamp) => {
      if (!bootcamp) {
        console.log("No se encontro el Bootcamp!");
        return null;
      }
      return User.findByPk(userId).then((user) => {
        if (!user) {
          console.log("Usuario no encontrado!");
          return null;
        }
        bootcamp.addUser(user);
        console.log('***************************')
        console.log(` Agregado el usuario id=${user.id} al bootcamp con id=${bootcamp.id}`);
        console.log('***************************')
        return bootcamp;
      });
    })
    .catch((err) => {
      console.log(">> Error mientras se estaba agregando Usuario al Bootcamp", err);
    });
};


// obtener los bootcamp por id 
exports.findById = (Id) => {
  return Bootcamp.findByPk(Id, {
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName"],
        through: {
          attributes: [],
        }
      }, ],
    })
    .then(bootcamp => {
      return bootcamp
    })
    .catch(err => {
      console.log(`>> Error mientras se encontraba el bootcamp: ${err}`)
    })
}

// obtener todos los Usuarios incluyendo los Bootcamp
exports.findAll = () => {
  return Bootcamp.findAll({
    include: [{
      model: User,
      as: "users",
      attributes: ["id", "firstName", "lastName"],
      through: {
        attributes: [],
      }
    }, ],
  }).then(bootcamps => {
    return bootcamps
  }).catch((err) => {
    console.log(">> Error Buscando los Bootcamps: ", err);
  });
}