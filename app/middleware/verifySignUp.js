//Verificación de correo, para saber si ya se encuentra ingresado al momento de de registrarse un nuevo usuario
const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.users;

const verifySignUp = async (obj) => {
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
};

module.exports = { verifySignUp };