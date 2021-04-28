const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

const classificacoesPorClienteId = {};
const {
    v4: uuidv4
} = require('uuid');

//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
app.put('/ingressos/:id/classificacoes', async (req, res) => {
    const idObs = uuidv4();
    const {
        nome,
        endereço,
        idade,
        status,
    } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const classificacoesPorCliente =
        classificacoesPorClienteId[req.params.id] || [];
    classificacoesPorCliente.push({
        id: idObs,
        nome,
        endereço,
        idade,
        status

    });
    classificacoesPorCliente[req.params.id] =
        classificacoesPorCliente;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ClassificacaoCriada",
        dados: {
            id: idObs,
            nome,
            endereço,
            idade,
            status,
            clienteId: req.params.id
        }
    })
    res.status(201).send(classificacoesPorCliente);
});
app.get('/clientes/:id/classificacoes', (req, res) => {
    res.send(classificacoesPorClienteId[req.params.id] || []);

});
app.listen(4000, (() => {
    console.log('Clientes  . Porta 5000');
}));