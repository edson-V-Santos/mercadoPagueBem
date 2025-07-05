const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {movimentacaoController} = require('../controllers/movimentacaoController');

// Rotas de  Movimentacao
router.get("/", movimentacaoController.listarMovimentacaos); // Rota responsável por listar os  Movimentacao do sistema.

router.post("/", movimentacaoController.cadastrarMovimentacao); // Rota responsável por cadastrar um novo  Movimentacao.

router.put("/:ID_Movimentacao", movimentacaoController.atualizarMovimentacao); // Rota responsável por atualizar os dados de um Movimentacao.

router.delete("/:ID_Movimentacao", movimentacaoController.deletarMovimentacao); // Rota responsável por deletar um Movimentacao.

module.exports = {movimentacaoRotas: router};