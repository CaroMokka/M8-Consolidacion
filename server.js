const db = require("./app/models");
const express = require("express");
//Importación de rutas
const userRoutes = require("./app/routes/user.routes.js");
const bootcampRoutes = require("./app/routes/bootcamp.routes.js")

const app = express();

const run = async () => {
  // Middleware para parsear JSON
  app.use(express.json());

  //Montaje de rutas
  app.use("/api/", userRoutes);
  app.use("/api/", bootcampRoutes)

  // Crear un Usuario
  // const user1 = await userController.createUser({
  //   firstName: 'Mateo',
  //   lastName: 'Díaz',
  //   email: 'mateo.diaz@correo.com'
  // })
  // console.log(user1)

  // const user2 = await userController.createUser({
  //   firstName: 'Santiago',
  //   lastName: 'Mejias',
  //   email: 'santiago.mejias@correo.com',
  // })

  // const user3 = await userController.createUser({
  //   firstName: 'Lucas',
  //   lastName: 'Rojas',
  //   email: 'lucas.rojas@correo.com',
  // })

  // const user4 = await userController.createUser({
  //   firstName: 'Facundo',
  //   lastName: 'Fernández',
  //   email: 'facundo.fernandez@correo.com',
  // })

  // // Crear un Bootcamp
  // const bootcamp1 = await bootcampController.createBootcamp({
  //   title: 'Introduciendo El Bootcamp De React',
  //   cue: 10,
  //   description: "React es la librería más usada en JavaScript para el desarrollo de interfaces",
  // })

  // const bootcamp2 = await bootcampController.createBootcamp({
  //   title: 'Bootcamp Desarrollo Web Full Stack',
  //   cue: 12,
  //   description: "Crearás aplicaciones web utilizando las tecnologías y lenguajes más actuales y populares como JavaScript, nodeJS, Angular, MongoDB, ExpressJS",
  // })

  // const bootcamp3 = await bootcampController.createBootcamp({
  //   title: 'Bootcamp Big Data, Inteligencia Artificial & Machine Learning',
  //   cue: 12,
  //   description: "Domina Data Science todo el ecosistema de lenguajes y herramientas de Big Data e intégralos con modelos avanzados de Artificial Intelligence y Machine Learning",
  // })

  // Agregando usuarios a los Bootcamp
  // await bootcampController.addUser(bootcamp1.id, user1.id);
  // await bootcampController.addUser(bootcamp1.id, user2.id);
  // await bootcampController.addUser(bootcamp2.id, user1.id);
  // await bootcampController.addUser(bootcamp3.id, user1.id);
  // await bootcampController.addUser(bootcamp3.id, user2.id);
  // await bootcampController.addUser(bootcamp3.id, user3.id);
  // await bootcampController.addUser(bootcamp3.id, user4.id);

  // Consultando el bootcamp(id) incluyendo los usuarios
  // const _bootcamp1 = await bootcampController.findById(bootcamp1.id);
  // console.log(" Bootcamp  ", JSON.stringify(_bootcamp1, null, 2));

  // Consultado  todos los bootcamp
  // const bootcamps = await bootcampController.findAll();
  // console.log(" Bootcamps: ", JSON.stringify(bootcamps, null, 2));

  // Consultado los usuarios (id) incluyendo los bootcamp
  // const _user = await userController.findUserById(user1.id);
  // console.log(" user1: ", JSON.stringify(_user, null, 2));

  // Listar todos los usuarios con sus bootcamp
  // const users = await userController.findAll();
  // console.log(">> usuarios: ", JSON.stringify(users, null, 2));

  // Actualización de usuario por id
  // const user = await userController.updateUserById(user1.id, "Pedro", "Sánchez");
  // const _user1 = await userController.findUserById(user1.id);
  // console.log(" user1: ", JSON.stringify(_user1, null, 2));

  //Eliminar un usuario por id
  //const duser1 = await userController.deleteUserById(user1.id);
};

// Sincronizar base de datos y luego iniciar el servidor
db.sequelize
  .sync({
    alter: true,
  })
  .then(() => {
    console.log("Eliminando y resincronizando la base de datos.");
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Aplicación ejecutándose por el puerto ${PORT}`);
    });
    run();
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
