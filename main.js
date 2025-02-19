/**
 * 
 * 
 */

//importaçao do modulo de coneçao (database.js)
const { conectar, desconectar } = require('./database.js')

//execuçao de aplicativo
const app = async () => {
    await conectar()
    await desconectar()

}

console.clear()
app()