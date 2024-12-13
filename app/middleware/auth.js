const jwt = require('jsonwebtoken')

const verifyToken = (token, secretKey) => {
    if(!token){
        return { message: "Usuario no autorizado. Debe enviar token de acceso.", code: 401, data: null }
      }
      const decodedToken = jwt.verify(token, secretKey)
      return { message: "Usuario autorizado con éxito.", code: 200, data: decodedToken }
}

module.exports = { verifyToken };