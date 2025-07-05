const express = require("express");
const router = express.Router();

const {produtosController} = require('../controllers/produtosController');
router.get("/", ProdutosController.listarProdutos);

router.post("/", produtosController.cadastrarVenda);

router.put("/:ID_Produto", produtosController.AtualizarProdutos);

router.delete("/:ID_produto", produtosController.deletarProduto )
