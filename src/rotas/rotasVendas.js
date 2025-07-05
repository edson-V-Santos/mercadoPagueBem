const express = require("express");
const router = express.Router();

const {vendasController} = require('../Controllers/vendasController');

router.get("/", vendasController.listarVendas);

router.post("/", vendasController.cadastrarVendas);

router.put("/:ID_Venda", vendasController.atualizarVendas);

router.delete("/:ID_Venda", vendasController.deletarVendas);

module.exports = {rotasVendas: router};