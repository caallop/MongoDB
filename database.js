/**
 * modulo de conexao com o banco de daos
 * uso de framework mongoose
 */

//importaçao do mongoose
const mongoose = require('mongoose')

//configuraçao do banco de dados
//ip ou link do srvidor, autenticaçao, nome do banco
const url = 'mongodb+srv://admin:123Senac@cluster0.y863a.mongodb.net/dbclientes'

//validaçao (evitar a abertura de varias conexões)

let conectado = false
//metodo para conectar o banco de dados
const conectar = async () => {
    //se nao estiver conectado, conectar 
    if (!conectado) {
        //conectar com o banco de dados
        try {
            await mongoose.connect(url)
            conectado = true
            console.log("MongoDB Conectado")
        } catch (error) {
            console.log(error)
        }
    }
}


//metodo para desconectar do banco de dados
const desconectar = async () => {
    //se estiver conectado qui dentro, desconectar
    if (conectado) {
        try {
            await mongoose.disconnect(url)//desconectar
            conectado = false
            console.log("MongoDB Desconectado")
        } catch (error) {
            console.error(error)
        }
    }
}

//exportar para o main os  metodos conectar e desconectar
module.exports = {conectar, desconectar}
