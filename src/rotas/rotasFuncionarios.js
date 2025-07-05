const express = require("express");
const router = express.Router();

const {funcionariosController} = require('../controllers/funcionariosController');
router.get("/", funcionariosController.listarFuncionarios);

router.post("/", funcionariosController.cadastrarFuncionarios);

router.put("/:ID_Produto", funcionariosController.AtualizarFuncionarios);

router.delete("/:ID_produto", funcionariosController.deletarFuncionarios);