const express = require('express');
const app = express();
const porta = 3000;
const cors = require('cors');

const usuarios = require('./database/usuarios');

app.use(cors());
app.use(express.json());

app.get('/', (req,  resp) => {
    resp.send('Api funcionando perfeitamente');
})

app.get('/usuarios', (req,  resp) => {
    resp.json(usuarios.obterTodos());
})

app.post('/usuarios', (req,  resp) => {
    var usuario = req.body;
    // Aqui tem que fazer um tratamento caso o usuario não passe o body corretamente.
    resp.send(usuarios.cadastrar(usuario));
})

app.put('/usuarios/:id', (req,  resp) => {
    var usuario = req.body;
    var { id } = req.params;
    usuario.id = Number(id);

    // Aqui tem que fazer um tratamento caso o usuario não passe o body corretamente.
    resp.send(usuarios.atualizar(usuario));
})

app.delete('/usuarios/:id', (req,  resp) => {

    var { id } = req.params;
    // Aqui tem que fazer um tratamento caso o usuario não passe o body corretamente.
    resp.send(usuarios.deletar(Number(id)));
})
app.listen(porta, () => console.log(`Api rodando na porta ${porta}`));
