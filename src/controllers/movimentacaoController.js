const { movimentacaoModel } = require("../models/movimentacaoModel");
const { produtosModel } = require("../models/produtosModel");
const { Op } = require("sequelize");

const movimentacaoController = {
    listarMovimentacaos: async (req, res) => {
        try {

            let movimentacao = await movimentacaoModel.findAll({
                include: [
                    {
                        model: produtosModel,
                        as: 'movimentacaoProduto',
                        attributes: ['ID_Produto', 'nomeProduto'],
                    }]
            });

            return res.status(200).json(movimentacao);

        } catch (error) {

            console.error("Erro ao listar Movimentação:", error);
            return res.status(500).json({ message: "Erro ao listar Movimentações!" });

        }
    },

    cadastrarMovimentacao: async (req, res) => {
        const transaction = await movimentacaoModel.sequelize.transaction();

        try {

            const { dataMovimentacao, tipoMovimentacao, qtdMovimentacao, idProdutoMovimentacao, } = req.body;

            if (!dataMovimentacao || !tipoMovimentacao || !idProdutoMovimentacao || !qtdMovimentacao === 0) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
            }
            const produto = await produtosModel.findByPk(idProdutoMovimentacao);
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado!" });
            }
            const novaMovimentacao = await movimentacaoModel.create({
                dataMovimentacao,
                tipoMovimentacao,
                idProdutoMovimentacao,
                qtdMovimentacao
            }, { transaction });
            await transaction.commit();

            return res.status(201).json({ message: "Venda cadastrada com sucesso!" });

        } catch (error) {


            await transaction.rollback();
            console.error("Erro ao cadastrar Movimentação:", error);
            return res.status(500).json({ message: "Erro ao cadastrar Movimentação!" });
        }
    },
    atualizarMovimentacao: async (req, res) => {
        let transaction = await movimentacaoModel.sequelize.transaction();
        try {
            const { ID_Movimentacao } = req.params;
            const { dataMovimentacao, valorTotalVenda, idProdutoMovimentacao, qtdMovimentacao, tipoMovimentacao } = req.body;

            let movimentacao = await movimentacaoModel.findByPk(ID_Movimentacao);

            if (!qtdMovimentacao, !tipoMovimentacao, !idProdutoMovimentacao) {
                return res.status(404).json({ message: 'Sem as informaçoes necessarias!' });
            }

            let dadosAtualizados = { dataMovimentacao, valorTotalVenda };
            await movimentacaoModel.update(
                dadosAtualizados,
                {
                    dataMovimentacao,
                    tipoMovimentacao,
                    qtdMovimentacao,
                    idProdutoMovimentacao
                }, {
                where: { ID_Movimentacao },
                transaction
            });

            dadosAtualizados = {};


            if (itensVenda) {

                for (const item of itensVenda) {

                    await movimentacaoModel.update(
                        { quantidadeItem: item.quantidadeItem },
                        {
                            where: { idVendaItem: ID_Produto, idProdutoItem: item.idProdutoItem },
                            transaction
                        }
                    );

                }

            }


            await transaction.commit();

            venda = await movimentacaoModel.findByPk(ID_Produto, {
                include: [
                    {
                        model: produtosModel,
                        as: 'vendasProdutos',
                        attributes: ['ID_Movimentacao', 'nomeProduto'],
                        through: {
                            attributes: ['quantidadeItem']
                        }
                    }
                ]
            });

            return res.status(200).json({ message: `Venda atualizada com sucesso:`, venda: venda });

        } catch (error) {

            await transaction.rollback();
            console.error("Erro ao atualizar venda:", error);
            return res.status(500).json({ message: "Erro ao atualizar venda!" });

        }
    },
    deletarMovimentacao: async (req, res) => {
        let transaction = await movimentacaoModel.sequelize.transaction();

        try {
            const { ID_Movimentacao } = req.params;

            const movimentacao = await movimentacaoModel.findByPk(ID_Movimentacao);

            if (!movimentacao) {
                return res.status(404).json({ message: 'Movimentação não encontrada!' });
            }

            const resultMovimentacao = await movimentacaoModel.destroy({
                where: { ID_Movimentacao },
                transaction
            });

            if (resultMovimentacao > 0) {
                await transaction.commit();
                return res.status(200).json({ message: `Movimentação excluída com sucesso!` });
            }

        } catch (error) {

            await transaction.rollback();
            console.error("Erro ao excluir Movimentação:", error);
            return res.status(500).json({ message: "Erro ao excluir Movimentação!" });
        }
    }
};

module.exports = { movimentacaoController }