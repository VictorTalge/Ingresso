const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const baseConsulta = {};

const funcoes = {
    IngressoCriado: (ingresso) => {
        baseConsulta[ingresso.contador] = ingresso;
    },
    ClassificacaoCriada: (classificacao) => {
        const classificacao =
            baseConsulta[classificacao.lembreteId]["classificacoes"] ||

            [];

        classificacoes.push(classificacao);
        baseConsulta[classificacao.lembreteId]["classificacoes"] =

            classificacoes;

    },
    ClassificacaoAtualizada: (classificacao) => {
        const classificacoes =
            baseConsulta[classificacao.lembreteId]["classificacoes"];
        const indice = classificacoes.findIndex((o) => o.id === classificacao.id);
        classificacoes[indice] = classificacao;
    }
};

app.get("/clientes", (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
    try {
        funcoes[req.body.tipo](req.body.dados);
    } catch (err) {}
    res.status(200).send(baseConsulta);
});

app.listen(6000, async () => {
    console.log("Consultas. Porta 6000");
    const resp = await axios.get("http://localhost:10000/eventos");
    resp.data.forEach((valor, indice, colecao) => {
        try {
            funcoes[valor.tipo](valor.dados);
        } catch (er) {}
    });
});