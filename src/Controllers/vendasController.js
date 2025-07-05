const { vendasModel } = require('../models/vendasModel');
const { vendasProdutosModel } = require('../models/vendasProdutosModel');
const { produtosModel } = require('../models/produtosModel');
const { Op } = require('sequelize');
// const { parseDateBd } = require('../utils/dateUtils');

const vendasController = {
    listarVendas: async (req, res) => {


        try {

            let vendas = await vendasModel.findAll({
                include: {
                    model: produtosModel,
                    as: 'vendasProdutos',
                    attributes: ['ID_Produto', 'nomeProduto'],
                    through: vendasProdutosModel
                }
            });

            return res.status(200).json(vendas);

        } catch (error) {

            console.error("Erro ao listar vendas:", error);
            return res.status(500).json({ message: "Erro ao listar vendas" });
        }

    },
    cadastrarVendas: async (req, res) => {
        let transaction = await vendasModel.sequelize.transaction();

        try {

            const { formaPagamento, valorTotal, dataCompra, idFuncionarioVenda, idClienteVenda, itensVenda } = req.body;

            // Validação para garantir que todos os campos obrigatórios sejam fornecidos
            if (!formaPagamento || !valorTotal || !dataCompra || !idFuncionarioVenda || !idClienteVenda || !itensVenda) {
                return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
            }

            const novaVenda = await vendasModel.create({ formaPagamento, dataCompra, valorTotal, idFuncionarioVenda, idClienteVenda }, { transaction });

            for (const item of itensVenda) {
                await vendasProdutosModel.create({
                    ID_VendaVP: novaVenda.ID_Venda,
                    ID_ProdutoVP: item.ID_ProdutoVP
                }, { transaction });
            }

            await transaction.commit();

            return res.status(201).json({ message: "Venda cadastrado com sucesso!" });

        } catch (error) {

            await transaction.rollback();

            console.error("Erro ao cadastrar venda:", error.message);
            return res.status(500).json({ message: "Erro ao cadastrar venda" });

        }

    },
    atualizarVendas: async (req, res) => {

        try {

            const { ID_Venda } = req.params;
            const { formaPagamento, dataCompra, valorTotal, idFuncionarioVenda, idClienteVenda } = req.body;

            let venda = await vendasModel.findByPk(ID_Venda);

            if (!venda) {
                return res.status(404).json({ message: "Venda não encontrado!" });
            }




            let dadosAtualizados = { formaPagamento, dataCompra, valorTotal, idFuncionarioVenda, idClienteVenda };

            await vendasModel.update(dadosAtualizados, { where: { ID_Venda } });

            venda = await vendasModel.findByPk(ID_Venda);

            venda.dataCompra = parseDateBd(venda.dataCompra);

            return res.status(200).json({ message: "Venda atualizado com sucesso:", Venda: venda });

        } catch (error) {

            console.error("Erro ao atualizar venda:", error);
            return res.status(500).json({ message: "Erro ao atualizar venda" });

        }


    },
    deletarVendas: async (req, res) => {
        let transaction = await vendasModel.sequelize.transaction();

        try {
            const { ID_Venda } = req.params;
            const { ID_Produto } = req.query;

            const venda = await vendasModel.findByPk(ID_Venda);

            if (!venda) {
                return res.status(404).json({ message: 'venda não encontrada!' });
            }

            if (ID_Produto) {

                const resultItem = await vendasProdutosModel.destroy({
                    where: { 
                        ID_VendaVP: ID_Venda, 
                        ID_ProdutoVP: ID_Produto 
                    },
                    transaction
                });

                if (resultItem > 0) {

                    await transaction.commit();
                    return res.status(200).json({ message: `Item excluído com sucesso!` });

                } else {
                    return res.status(404).json({ message: 'Erro ao excluir item!' });
                }

            } else {

                await vendasProdutosModel.destroy({
                    where: { ID_VendaVP: ID_Venda },
                    transaction
                });
            }

            const resultVenda = await vendasModel.destroy({
                where: { ID_Venda },
                transaction
            });

            if (resultVenda > 0) {
                await transaction.commit();
                return res.status(200).json({ message: `Venda excluída com sucesso!` });
            } else {
                return res.status(404).json({ message: 'Erro ao excluir venda!' });
            }

        } catch (error) {

            // Rollback cancela a transação se ocorrer qualquer erro
            await transaction.rollback();
            console.error("Erro ao excluir venda:", error);
            return res.status(500).json({ message: "Erro ao excluir venda!" });
        };
    }
};

module.exports = { vendasController };