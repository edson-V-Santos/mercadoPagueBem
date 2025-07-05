const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {fornecedoresController} = require('../controllers/fornecedoresController');

// Rotas de Alunos
router.get("/", fornecedoresControllerController.listarFornecedores); // Rota responsável por listar os alunos do sistema.

router.post("/", fornecedoresController.cadastrarFornecedores); // Rota responsável por cadastrar um novo fornecedores.

router.put("/:ID_Fornecedores", fornecedoresController.atualizarFornecedores); // Rota responsável por atualizar os dados de um aluno.
router.delete("/:ID_Fornecedores", fornecedoresController.deletarFornecedores)