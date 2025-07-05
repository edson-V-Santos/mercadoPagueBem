const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {VendasModel} = require('../controllers/VendasModel');

// Rotas de Vendas
router.get("/",vendasModel.listarVendas); // Rota responsável por listar os  Vendas do sistema.

router.post("/",vendasModel.cadastrarVendas); // Rota responsável por cadastrar um novo  Vendas.

router.put("/:ID_Vendas", vendasModel.atualizarVendas); // Rota responsável por atualizar os dados de um Vendas.

router.delete("/:ID_Vendas", vendasModel.deletarVendas); // Rota responsável por deletar um Vendas.

module.exports = { rotasVendas: router};