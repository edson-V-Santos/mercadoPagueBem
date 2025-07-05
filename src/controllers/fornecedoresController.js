const { fornecedorModel } = require('../models/fornecedorModel');
const { Op } = require('sequelize');
const {parseDateBd} = require('../utils/dateUtils');

const fornecedorController = {
    listarFornecedores: async (req, res) => {

        try {
       let { nomeFornecedores, cpfFornecedores, emailFornecedores } = req.query;
            let conditions = {};

            if (nomeFornecedores) {
                conditions.nomeFornecedores = nomeFornecedores;
            }
                if (cpfFornecedores) {
                conditions.cpfFornecedores = cpfFornecedores;
            }
                 if (emailFornecedores) {
                conditions.emailFornecedores = emailFornecedores;
            }


            let fornecedor = await fornecedorModel.findAll({
                where: conditions

            });

            // Utiliza a função parseDateBd para corrigir possíveis problemas de fuso horário
            // Retorna um novo array com as datas corrigidas

            return res.status(200).json(fornecedor);

        } catch (error) {

            console.error("Erro ao listar fornecedor:", error);
            return res.status(500).json({ message: "Erro ao listar fornecedor" });
        }

    },
    cadastrarFornecedores: async (req, res) => {

        try {

            const { nomeFornecedores, cpfFornecedores, emailFornecedores, celularFornecedores, enderecoFornecedores } = req.body;

            // Validação para garantir que todos os campos obrigatórios sejam fornecidos
            if (!nomeFornecedores || !cpfFornecedores || !emailFornecedores) {
                return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
            }

            let fornecedor = await fornecedorModel.findOne({
                where: {
                    [Op.or]: [
                        { cpfFornecedores },
                        { emailFornecedores }
                    ]
                }
            });

            if (fornecedor) {
                return res.status(409).json({ message: "Fornecedores já cadastrado!" });
            }

            await fornecedorModel.create({ nomeFornecedores, cpfFornecedores, emailFornecedores, celularFornecedores, enderecoFornecedores });

            return res.status(201).json({ message: "Fornecedores cadastrado com sucesso!" });

        } catch (error) {

            console.error("Erro ao cadastrar fornecedor:", error);
            return res.status(500).json({ message: "Erro ao cadastrar fornecedor" });

        }

    },
    atualizarFornecedores: async (req, res) => {

        try {

            const { ID_Fornecedores } = req.params;
            const { nomeFornecedores, cpfFornecedores, emailFornecedores, celularFornecedores, enderecoFornecedores } = req.body;

            let fornecedor = await fornecedorModel.findByPk(ID_Fornecedores);

            if (!fornecedor) {
                return res.status(404).json({ message: "Fornecedores não encontrado!" });
            }

            if (cpfFornecedores || emailFornecedores) {

                fornecedor = await fornecedorModel.findOne({
                    where: {
                        [Op.or]: [
                            { cpfFornecedores },
                            { emailFornecedores }
                        ]
                    }
                });

                if (fornecedor) {
                    return res.status(409).json({ message: "Email ou CPF já cadastrados" });
                }

            }

            let dadosAtualizados = { nomeFornecedores, cpfFornecedores, emailFornecedores, celularFornecedores, enderecoFornecedores };

            await fornecedorModel.update(dadosAtualizados, { where: { ID_Fornecedores } });

            fornecedor = await fornecedorModel.findByPk(ID_Fornecedores);


            return res.status(200).json({ message: "Fornecedores atualizado com sucesso:", Fornecedores: fornecedor });

        } catch (error) {

            console.error("Erro ao atualizar fornecedor:", error);
            return res.status(500).json({ message: "Erro ao atualizar fornecedor" });

        }


    },
    deletarFornecedores: async (req, res) => {

        try {
            const { ID_Fornecedores } = req.params;
    
            let fornecedor = await fornecedorModel.findByPk(ID_Fornecedores);
    
            if (!fornecedor) {
                return res.status(404).json({ message: "Fornecedores não encontrado!" });
            }
    
            let nomeFornecedores = fornecedor.nomeFornecedores;

            let result = await fornecedorModel.destroy({where: {ID_Fornecedores}});

            if (result>0) {
                return res.status(200).json({ message: `${nomeFornecedores} foi excluído com sucesso!`});
            } else{
                return res.status(404).json({ message: "Erro ao excluir fornecedor!"});
            }
            
        } catch (error) {

            console.error("Erro ao excluir fornecedor:",error);
            return res.status(500).json({ message: "Erro ao excluir fornecedor" });
            
        }

    }
};
