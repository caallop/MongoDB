/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

//importaçao do pacote "string similarity", para aprimorar a busca por nomes (exemplo 2)
const stringsimilarity = require('string-similarity')
// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
        // a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")

    } catch (error) {
        //tratamento de exceções específicas
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}
// CRUD read - Funçao paa listar todos os clientes cadastrados

const listarClientes = async () => {
    try {
        //a linha abaixo lista todos os clientes
        const clientes = await clienteModel.find()
        console.log(clientes)

    } catch (error) {
        console.log(error)
    }
}

// CRUD READ - funçao para buscar um cliente especifico (exemplo 2)
//passado parâmetro nome, como pode ser alterdo o cpf
const buscarCliente = async (nome) => {
    try {
        // find () buscar
        // nomeCliente: new RegExp(nome) filtro pelo nome (partes que contenham (expressão regular))
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find({ nomeCliente: new RegExp(nome, 'i') })

        //calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        // validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringsimilarity.findBestMatch(nome, nomesClientes)
            // cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            // Formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpfCliente: melhorCliente.cpfCliente,
                dataCadastro: melhorCliente.dataCadastro.toLocaleString('pt-BR')
            }
            console.log(clienteFormatado)
        }



    } catch (error) {
        console.log(error)
    }
}


const atualizarCliente = async (id, nomeCli, foneCli, cpfCli) => {
    try {
        const cliente = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli


            },
            {
                new: true,
                runValidators: true
            }
        )
        //retorno do banco de dados
        if (!cliente) {
            console.log("cliente nao encontrado")
        } else {
            console.log("nome do cliente alterado com sucesso")
        }
    } catch (error) {
        console.log(error)
    }

}
//exclusao de cliente
const deletarCliente = async (id) => {
    try {
        const cliente = await clienteModel.findByIdAndDelete(id)


        if (!cliente) {
            console.log("cliente nao encontrado")
        } else {
            console.log("cliente excluido com sucesso")
        }
    } catch (error) {
        console.log(error)
    }
}
// execução da aplicação
const app = async () => {
    await conectar()

    //CRUD -cread

    await criarCliente("José de Assis", "99999-1234", "123.456.789-02")
    await criarCliente("Mauricio de Assis", "99998-1234", "133.456.789-03")
    await criarCliente("Mauro da Silva", "99999-1235", "163.456.789-04")
    await criarCliente("Maurício Silva", "99999-1235", "124.456.789-05")

    //CRUD- read (exemplo 1- listar todos os clientes)
    //await listarClientes()

    //CRUD- read (exemplo 2- trazer um cliente especifico)
    //esta dando erro. (alguma coisa com o npm string similarity)
    //await buscarCliente("jose")

    //CRUD- UPDATE-- alterar os dados de um cliente
    //ATENÇAO!!!- obrigatoriamente, o update precisa ser feita com base no ID do cliente

    await atualizarCliente('67be536e58615ac864a865b7', 'o homem do bem', '42312412-666', '432.423.421-99')

    //CRUD- delete - funço para excluir um cliente
    //ATENÇAO!!!- orbigatoriamente, a exclusao é feita pelo id
    await deletarCliente('67be536e58615ac864a865bc')

    //await listarClientes()



    await desconectar()
}

console.clear()
app()
