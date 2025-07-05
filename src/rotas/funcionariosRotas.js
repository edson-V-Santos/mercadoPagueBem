const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const { funcionariosModel} = require('../controllers/ funcionariosModel');

// Rotas de Funcionario
router.get("/",  funcionariosModel.listarFuncionarios); // Rota responsável por listar os Funcionario do sistema.

router.post("/",  funcionariosModel.cadastrarFuncionario); // Rota responsável por cadastrar um novo Funcionario.

router.put("/:ID_Fornecedor",  funcionariosModel.atualizarFuncionario); // Rota responsável por atualizar os dados de um Funcionario.

router.delete("/:ID_Funcionario",  funcionariosModel.deletarFuncionario); // Rota responsável por deletar um Funcionario.

module.exports = { rotasFuncionario: router};