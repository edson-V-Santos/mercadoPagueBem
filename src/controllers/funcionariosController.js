const { funcionarioModel } = require('../models/funcionarioModel');
const { Op } = require('sequelize');
const {parseDateBd} = require('../utils/dateUtils');

const funcionarioController = {
    listarFuncionario: async (req, res) => {

        try {
       let { nomeFuncionario, cpfFuncionario, emailFuncionario, nivelAcesso,} = req.query;
            let conditions = {};

            if (nomeFuncionario) {
                conditions.nomeFuncionario = nomeFuncionario;
            }
                if (cpfFuncionario) {
                conditions.cpfFuncionario = cpfFuncionario;
            }
                 if (emailFuncionario) {
                conditions.emailFuncionario = emailFuncionario;
            }
            
            if (nivelAcesso) {
                conditions.nivelAcesso = nivelAcesso;
            }


            let funcionario = await funcionarioModel.findAll({
                where: conditions

            });

            // Utiliza a função parseDateBd para corrigir possíveis problemas de fuso horário
            // Retorna um novo array com as datas corrigidas

            return res.status(200).json(funcionario);

        } catch (error) {

            console.error("Erro ao listar funcionario:", error);
            return res.status(500).json({ message: "Erro ao listar funcionario" });
        }

    },
    cadastrarFuncionario: async (req, res) => {

        try {

            const { nomeFuncionario, emailFuncionario, cpfFuncionario,nivelAcesso,senhaFuncionario , celularFuncionario, enderecoFuncionario } = req.body;

            // Validação para garantir que todos os campos obrigatórios sejam fornecidos
            if (!nomeFuncionario || !cpfFuncionario || !emailFuncionario || !nivelAcesso || !senhaFuncionario) {
                return res.status(400).json({ message: "Campos obrigatórios não preenchidos" });
            }

            let funcionario = await funcionarioModel.findOne({
                where: {
                    [Op.or]: [
                        { cpfFuncionario },
                        { emailFuncionario },
                    ]
                }

            });

            if (funcionario) {
                return res.status(409).json({ message: "Funcionario já cadastrado!" });
            }
             const senhaCriptografada = await bcrypt.hash(senhaFuncionario, 10);

            await funcionarioModel.create({ nomeFuncionario,nivelAcesso, senhaFuncionario: senhaCriptografada, cpfFuncionario, emailFuncionario, celularFuncionario, enderecoFuncionario });

            return res.status(201).json({ message: "Funcionario cadastrado com sucesso!" });

        } catch (error) {

            console.error("Erro ao cadastrar funcionario:", error);
            return res.status(500).json({ message: "Erro ao cadastrar funcionario" });

        }

    },
    atualizarFuncionario: async (req, res) => {

        try {

            const { ID_Funcionario } = req.params;
            const { nomeFuncionario, cpfFuncionario, emailFuncionario, celularFuncionario, enderecoFuncionario } = req.body;

            let funcionario = await funcionarioModel.findByPk(ID_Funcionario);

            if (!funcionario) {
                return res.status(404).json({ message: "Funcionario não encontrado!" });
            }

            if (cpfFuncionario || emailFuncionario) {

                funcionario = await funcionarioModel.findOne({
                    where: {
                        [Op.or]: [
                            { cpfFuncionario },
                            { emailFuncionario }
                        ]
                    }
                });

                if (funcionario) {
                    return res.status(409).json({ message: "Email ou CPF já cadastrados" });
                }

            }

            let dadosAtualizados = { nomeFuncionario, cpfFuncionario, emailFuncionario, celularFuncionario, enderecoFuncionario };

            await funcionarioModel.update(dadosAtualizados, { where: { ID_Funcionario } });

            funcionario = await funcionarioModel.findByPk(ID_Funcionario);


            return res.status(200).json({ message: "Funcionario atualizado com sucesso:", Funcionario: funcionario });

        } catch (error) {

            console.error("Erro ao atualizar funcionario:", error);
            return res.status(500).json({ message: "Erro ao atualizar funcionario" });

        }


    },
    deletarFuncionario: async (req, res) => {

        try {
            const { ID_Funcionario } = req.params;
    
            let funcionario = await funcionarioModel.findByPk(ID_Funcionario);
    
            if (!funcionario) {
                return res.status(404).json({ message: "Funcionario não encontrado!" });
            }
    
            let nomeFuncionario = funcionario.nomeFuncionario;

            let result = await funcionarioModel.destroy({where: {ID_Funcionario}});

            if (result>0) {
                return res.status(200).json({ message: `${nomeFuncionario} foi excluído com sucesso!`});
            } else{
                return res.status(404).json({ message: "Erro ao excluir funcionario!"});
            }
            
        } catch (error) {

            console.error("Erro ao excluir funcionario:",error);
            return res.status(500).json({ message: "Erro ao excluir funcionario" });
            
        }

    }
};
