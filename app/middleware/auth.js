const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;

const verifyToken = async (obj) => {
  try {
    const { email, password } = obj;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return { message: "Usuario no encontrado", code: 404, data: user };
    }
    const { password: pswd, ...data } = user.dataValues;
    const isMatchPass = await bcrypt.compare(password, user.password);
    if (isMatchPass) {
      return { message: "Usuario encontrado con exito.", code: 200, data: data };
    }
  } catch (err) {
    console.log(err);
  }

  // try{
  //     return User.findOne({
  //         where: {
  //           email: obj.email,
  //           password: obj.password
  //         }
  //     }).then( user => {return user.dataValues[0]})
  //     .catch(err => {
  //         console.log(`>> Error mientras se encontraba el usuario: ${err}`)
  //       })
  // } catch(err) {
  //     console.log(err.message)
  // }
};

module.exports = { verifyToken };
