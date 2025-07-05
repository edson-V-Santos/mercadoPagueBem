const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {ProdutosProdutosModel} = require('../controllers/ProdutosModel');

// Rotas de vendasProdutos
router.get("/",vendasProdutosModel.listarVendas); // Rota responsável por listar os vendasProdutosdo sistema.

router.post("/",vendasProdutosModel.cadastrarVendas); // Rota responsável por cadastrar um novo  vendasProdutos.

router.delete("/:ID_ProdutosVP/: ID_VendaVP", vendasProdutosModel.deletarVendas); // Rota responsável por deletar um vendasProdutos.

module.exports = { rotasvendasProdutos: router};