const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {clientesModel} = require('../controllers/clientesModel');

// Rotas de  cliente
router.get("/", clientesModel.listarClientes); // Rota responsável por listar os  cliente do sistema.

router.post("/", clientesModel.cadastrarCliente); // Rota responsável por cadastrar um novo  cliente.

router.put("/:ID_Cliente", clientesModel.atualizarCliente); // Rota responsável por atualizar os dados de um cliente.

router.delete("/:ID_Cliente", clientesModel.deletarClientes); // Rota responsável por deletar um cliente.

module.exports = { rotasCliente: router};