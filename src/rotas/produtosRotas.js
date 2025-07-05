const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {produtosModel} = require('../controllers/produtosModel');

// Rotas de Produtos
router.get("/", produtosModel.listarProdutos); // Rota responsável por listar os  Produtos do sistema.

router.post("/", produtosModel.cadastrarProdutos); // Rota responsável por cadastrar um novo  Produtos.

router.put("/:ID_Produtos", produtosModel.atualizarProdutos); // Rota responsável por atualizar os dados de um Produtos.

router.delete("/:ID_Produtos", produtosModel.deletarProdutos); // Rota responsável por deletar um Produtos.

module.exports = { rotasProdutos: router};