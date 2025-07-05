const { clienteModel } = require('../models/clienteModel');
const { Op } = require('sequelize');
const {parseDateBd} = require('../utils/dateUtils');

const clienteController = {
    listarClientes: async (req, res) => {

        try {
       let { nomeClientes, cpfClientes, emailClientes } = req.query;
            let conditions = {};

            if (nomeClientes) {
                conditions.nomeClientes = nomeClientes;
            }
                if (cpfClientes) {
                conditions.cpfClientes = cpfClientes;
            }
                 if (emailClientes) {
                conditions.emailClientes = emailClientes;
            }


            let cliente = await clienteModel.findAll({
                where: conditions

            });


            // Mapeia o array de cliente para ajustar a data de nascimento de cada cliente
            // Utiliza a função parseDateBd para corrigir possíveis problemas de fuso horário
            // Retorna um novo array com as datas corrigidas

            return res.status(200).json(cliente);

        } catch (error) {

            console.error("Erro ao listar cliente:", error);
            return res.status(500).json({ message: "Erro ao listar cliente" });
        }

    },
    cadastrarClientes: async (req, res) => {

        try {

            const { nomeClientes, cpfClientes, emailClientes, celularClientes, enderecoClientes } = req.body;

            // Validação para garantir que todos os campos obrigatórios sejam fornecidos
            if (!nomeClientes || !cpfClientes || !emailClientes) {
                return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
            }

            let cliente = await clienteModel.findOne({
                where: {
                    [Op.or]: [
                        { cpfClientes },
                        { emailClientes }
                    ]
                }
            });

            if (cliente) {
                return res.status(409).json({ message: "Clientes já cadastrado!" });
            }

            await clienteModel.create({ nomeClientes, cpfClientes, emailClientes, celularClientes, enderecoClientes });

            return res.status(201).json({ message: "Clientes cadastrado com sucesso!" });

        } catch (error) {

            console.error("Erro ao cadastrar cliente:", error);
            return res.status(500).json({ message: "Erro ao cadastrar cliente" });

        }

    },
    atualizarClientes: async (req, res) => {

        try {

            const { ID_Cliente } = req.params;
            const { nomeClientes, cpfClientes, emailClientes, celularClientes, enderecoClientes } = req.body;

            let cliente = await clienteModel.findByPk(ID_Cliente);

            if (!cliente) {
                return res.status(404).json({ message: "Clientes não encontrado!" });
            }

            if (cpfClientes || emailClientes) {

                cliente = await clienteModel.findOne({
                    where: {
                        [Op.or]: [
                            { cpfClientes },
                            { emailClientes }
                        ]
                    }
                });

                if (cliente) {
                    return res.status(409).json({ message: "Email ou CPF já cadastrados" });
                }

            }

            let dadosAtualizados = { nomeClientes, cpfClientes, emailClientes, celularClientes, enderecoClientes };

            await clienteModel.update(dadosAtualizados, { where: { ID_Cliente } });

            cliente = await clienteModel.findByPk(ID_Cliente);


            return res.status(200).json({ message: "Clientes atualizado com sucesso:", Clientes: cliente });

        } catch (error) {

            console.error("Erro ao atualizar cliente:", error);
            return res.status(500).json({ message: "Erro ao atualizar cliente" });

        }


    },
    deletarClientes: async (req, res) => {

        try {
            const { ID_Cliente } = req.params;
    
            let cliente = await clienteModel.findByPk(ID_Cliente);
    
            if (!cliente) {
                return res.status(404).json({ message: "Clientes não encontrado!" });
            }
    
            let nomeClientes = cliente.nomeClientes;

            let result = await clienteModel.destroy({where: {ID_Cliente}});

            if (result>0) {
                return res.status(200).json({ message: `${nomeClientes} foi excluído com sucesso!`});
            } else{
                return res.status(404).json({ message: "Erro ao excluir cliente!"});
            }
            
        } catch (error) {

            console.error("Erro ao excluir cliente:",error);
            return res.status(500).json({ message: "Erro ao excluir cliente" });
            
        }

    }
};

module.exports = { clienteController };