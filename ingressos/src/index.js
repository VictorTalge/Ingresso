const express = require('express');
const app = express();
app.use(express.json());
const axios = require('axios');

const observacoesPorLembreteId = {};
const {
    v4: uuidv4
} = require('uuid');

//:id é um placeholder
//exemplo: /lembretes/123456/observacoes
app.put('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const {
        texto
    } = req.body;
    //req.params dá acesso à lista de parâmetros da URL
    const observacoesDoLembrete =
        observacoesPorLembreteId[req.params.id] || [];
    observacoesDoLembrete.push({
        id: idObs,
        texto
    });
    observacoesPorLembreteId[req.params.id] =
        observacoesDoLembrete;
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id
        }
    })
    res.status(201).send(observacoesDoLembrete);
});
app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);

});
app.listen(7000, (() => {
    console.log('Lembretes  . Porta 5000');
}));