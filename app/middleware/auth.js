//funcion de verificación de token verifyToken()
const db = require("./app/models");


const verifyToken = (email, password) => {
    try{
        const response = db.sequelize.query("SELECT * FROM users WHERE email=$1 AND password=$2", [email, password])
        console.log(response)
    } catch(err) {
        console.log(err)
    }
}

module.exports = { verifyToken }