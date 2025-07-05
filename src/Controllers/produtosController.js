
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

            await produtosModel.create({ nomeProduto, categoriaProduto,qtdMin, qtdAtual, dataCadastro, dataVencimento, codigoSku, idFuncionarioProduto, idFornecedorProduto, precoProduto });



            return res.status(201).json({ message: "Produto cadastrado com sucesso!" });

        } catch (error) {

            console.error("Erro ao cadastrar produto:", error);
            return res.status(500).json({ message: "Erro ao cadastrar produto" });

        }

    },
    atualizarProduto: async (req, res) => {

        try {

            const { ID_Aluno } = req.params;
            const { nomeAluno, cpfAluno, dataNascimentoAluno, emailAluno, telefoneAluno, enderecoAluno } = req.body;

            let aluno = await alunoModel.findByPk(ID_Aluno);

            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado!" });
            }

            if (cpfAluno || emailAluno) {

                aluno = await alunoModel.findOne({
                    where: {
                        [Op.or]: [
                            { cpfAluno },
                            { emailAluno }
                        ]
                    }
                });

                if (aluno) {
                    return res.status(409).json({ message: "Email ou CPF já cadastrados" });
                }

            }

            let dadosAtualizados = { nomeAluno, cpfAluno, dataNascimentoAluno, emailAluno, telefoneAluno, enderecoAluno };

            await alunoModel.update(dadosAtualizados, { where: { ID_Aluno } });

            aluno = await alunoModel.findByPk(ID_Aluno);

            aluno.dataNascimentoAluno = parseDateBd(aluno.dataNascimentoAluno);

            return res.status(200).json({ message: "Aluno atualizado com sucesso:", Aluno: aluno });

        } catch (error) {

            console.error("Erro ao atualizar aluno:", error);
            return res.status(500).json({ message: "Erro ao atualizar aluno" });

        }


    },
    deletarProduto: async (req, res) => {

        try {
            const { ID_Aluno } = req.params;
    
            let aluno = await alunoModel.findByPk(ID_Aluno);
    
            if (!aluno) {
                return res.status(404).json({ message: "Aluno não encontrado!" });
            }
    
            let nomeAluno = aluno.nomeAluno;

            let result = await alunoModel.destroy({where: {ID_Aluno}});

            if (result>0) {
                return res.status(200).json({ message: `${nomeAluno} foi excluído com sucesso!`});
            } else{
                return res.status(404).json({ message: "Erro ao excluir aluno!"});
            }
            
        } catch (error) {

            console.error("Erro ao excluir aluno:",error);
            return res.status(500).json({ message: "Erro ao excluir aluno" });
            
        }

    }
};

module.exports = { produtosController };