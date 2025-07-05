const express = require("express");

// IMPORTAÇÃO DE ROTAS

const {rotasVendas} = require('./src/rotas/rotasVendas');

// APP

const app = express(); // Cria uma instância do Express, armazenando todos os métodos e funcionalidades em 'app'.

const PORT = 8081; // Define a porta em que o servidor irá escutar as requisições.

app.use(express.json()); // Configura o body-parser para interpretar corpos de requisição no formato JSON.

app.use("/vendas", rotasVendas);

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
});
