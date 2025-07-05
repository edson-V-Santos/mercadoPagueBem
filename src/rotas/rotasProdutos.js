const express = require("express");
const router = express.Router();

const {produtosController} = require('../controllers/produtosController');

router.get("/", produtosController.listarProdutos);

router.post("/", produtosController.cadastrarProduto);

router.put("/:ID_Produto", produtosController.atualizarProduto);

router.delete("/:ID_produto", produtosController.deletarProduto );

module.exports = {rotasProdutos: router};
