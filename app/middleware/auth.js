const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;

const verifyToken = (obj) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, password } = obj;
      const user = await User.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        console.log("Usuario no encontrado.");
      }
      const { password: pswd, ...data } = user.dataValues;
      const isMatchPass = await bcrypt.compare(password, user.password);
      if (isMatchPass) {
        resolve(data);
      }
    } catch (err) {
      reject(err);
    }
  });
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
