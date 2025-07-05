
const { produtosModel } = require('../models/produtosModel');
const { Op } = require('sequelize');


const produtosController = {
    listarProdutos: async (req, res) => {

        try {
            let {nomeProduto} = req.query;

            let conditions = {};

            if (nomeProduto) {
                conditions.nomeProduto = nomeProduto;
            }

            let produtos = await produtosModel.findAll({
                where: conditions,
            
            });

            return res.status(200).json(produtos);

        } catch (error) {

            console.error("Erro ao listar produtos:", error);
            return res.status(500).json({ message: "Erro ao listar Produtos" });
        }

    },
    cadastrarProduto: async (req, res) => {

        try {

            const {nomeProduto, categoriaProduto,qtdMin, qtdAtual, dataCadastro, dataVencimento, codigoSku, idFuncionarioProduto, idFornecedorProduto, precoProduto} = req.body;

            // Validação para garantir que todos os campos obrigatórios sejam fornecidos
            if (!nomeProduto || !categoriaProduto || !qtdMin || !qtdAtual || !dataCadastro || !dataVencimento || !codigoSku || !idFuncionarioProduto || !idFornecedorProduto || !precoProduto) {
                return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
            }

            let produto = await produtosModel.findOne({
                where: {
                    [Op]: [
                        { codigoSku }
                    
                    ]
                }
            });

            if (produto) {
                return res.status(409).json({ message: "Codigo Sku já utilizado" });
            }
            await produtosModel.create({ nomeProduto, categoriaProduto,qtdMin, qtdAtual, dataCadastro, dataVencimento, codigoSku, idFuncionarioProduto, idFornecedorProduto, precoProduto });



            return res.status(201).json({ message: "Produto cadastrado com sucesso!" });

        } catch (error) {

            console.error("Erro ao cadastrar produto:", error);
            return res.status(500).json({ message: "Erro ao cadastrar produto" });

        }

    },
    atualizarProduto: async (req, res) => {

        try {

            const { ID_Produto } = req.params;
            const { nomeProduto, categoriaProduto,qtdMin, qtdAtual, dataCadastro, dataVencimento, codigoSku, idFuncionarioProduto, idFornecedorProduto, precoProduto} = req.body;

            let produto = await produtosModel.findByPk(ID_Produto);

            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            let dadosAtualizados = { nomeProduto, categoriaProduto,qtdMin, qtdAtual, dataCadastro, dataVencimento, codigoSku, idFuncionarioProduto, idFornecedorProduto, precoProduto };

            await produtosModel.update(dadosAtualizados, { where: { ID_Produto } });

            return res.status(200).json({ message: "Aluno atualizado com sucesso:", Produto: produto });

        } catch (error) {

            console.error("Erro ao atualizar Produto:", error);
            return res.status(500).json({ message: "Erro ao atualizar Produto" });

        }


    },
    deletarProduto: async (req, res) => {

        try {
            const { ID_Produto } = req.params;
    
            let produto = await produtosModel.findByPk(ID_Produto);
    
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }

            let nomeProduto = produto.nomeProduto;

            let result = await produtosModel.destroy({where: {ID_Produto}});

            if (result>0) {
                return res.status(200).json({ message: `${nomeProduto} foi excluído com sucesso!`});
            } else{
                return res.status(404).json({ message: "Erro ao excluir Produto!"});
            }
            
        } catch (error) {

            console.error("Erro ao excluir produto:",error);
            return res.status(500).json({ message: "Erro ao excluir produto" });
            
        }

    }
};

module.exports = { produtosController };