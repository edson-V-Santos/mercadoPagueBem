const express = require("express");
const router = express.Router(); // Instancia o router, um objeto do Express usado para definir rotas de forma modular e organizada.

const {fornecedoresModel} = require('../controllers/fornecedoresModel');

// Rotas de Fornecedor
router.get("/", fornecedoresModel.listarFornecedores); // Rota responsável por listar os Fornecedor do sistema.

router.post("/", fornecedoresModel.cadastrarFornecedor); // Rota responsável por cadastrar um novo Fornecedor.

router.put("/:ID_Fornecedor", fornecedoresModel.atualizarFornecedor); // Rota responsável por atualizar os dados de um Fornecedor.

router.delete("/:ID_Fornecedor", fornecedoresModel.deletarFornecedor); // Rota responsável por deletar um Fornecedor.

module.exports = { rotasFornecedor: router};