const express = require('express');
const path = require('path');
const sql = require('mssql');
const { log } = require('console');

const app = express();
const PORT = 3000;

// Configuração do banco de dados
const config = {
    user: 'dsmpidois',
    password: 'DSMp!002',
    server: 'dsmpidois.database.windows.net',
    database: 'dbdsmpi2',
    options: {
        encrypt: true // Dependendo da configuração do seu servidor SQL Server
    }
};

app.use(express.json());

// Servir arquivos estáticos (como index.html)
app.use(express.static(path.join(__dirname)));

app.post('/validar_usuario', async (req, res) => {
    let { email, senha } = req.body;

    email = email.trim()
    senha = senha.trim()

    try {
        await sql.connect(config);
        const request = new sql.Request();

        request.input('email', sql.VarChar, email);
        request.input('senha', sql.VarChar, senha);

        const result = await request.query(`
        SELECT * FROM Usuarios WHERE email = @email AND senha = @senha`);

        if (result.recordset.length > 0) {
            res.status(200).send('Usuário encontrado!');
        } else {
            res.status(401).send('Email ou senha inválidos.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Ocorreu um erro no servidor.');
    }
});

app.post('/cadastrar_usuario', async (req, res) => {
    let { nome, email, senha } = req.body;

    nome = nome.trim()
    email = email.trim()
    senha = senha.trim()

    try {
        await sql.connect(config);
        const request = new sql.Request();

        request.input('nome', sql.VarChar, nome);
        request.input('email', sql.VarChar, email);
        request.input('senha', sql.VarChar, senha);

        await request.query(`
        MERGE INTO Usuarios AS target
        USING (VALUES (@nome, @email, @senha)) 
            AS source (Nome, Email, Senha)
            ON target.Email = source.Email
        WHEN NOT MATCHED THEN
            INSERT (Nome, Email, Senha) VALUES (source.Nome, source.Email, source.Senha);
        `);
        res.status(200).send('Cadastro realizado com sucesso.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor.');
    }
});

app.post('/atualizar_vida', async (req, res) => {
    const { vidaHeroi, vidaVilao, acaoHeroi, acaoVilao } = req.body;
    try {
        await sql.connect(config);
        const request = new sql.Request();

        request.input('vidaHeroi', sql.Int, vidaHeroi);
        request.input('vidaVilao', sql.Int, vidaVilao);
        request.input('acaoHeroi', sql.Char, acaoHeroi);
        request.input('acaoVilao', sql.Char, acaoVilao);
        
        await request.query(`
        MERGE INTO Personagens AS target
        USING (VALUES ('GOHAN', @vidaHeroi, @acaoHeroi), ('CELL', @vidaVilao, @acaoVilao)) AS source (Nome, Vida, Acao)
        ON target.Nome = source.Nome
        WHEN MATCHED THEN
            UPDATE SET Vida = source.Vida, 
            Acao = CASE 
                        WHEN source.Acao <> '' THEN source.Acao
                        ELSE target.Acao
                    END
        WHEN NOT MATCHED THEN
            INSERT (Nome, Vida, Acao) VALUES (source.Nome, source.Vida, source.Acao);
        `);
        res.status(200).send('Cadastro realizado com sucesso.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor.');
    }
});

// Rota para fornecer os dados do herói e do vilão
app.get('/characters', async (req, res) => {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        // Consulta para obter os dados do herói
        const heroResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'GOHAN'");
        const heroi = heroResult.recordset[0];

        // Consulta para obter os dados do vilão
        const villainResult = await request.query("SELECT * FROM Personagens WHERE Nome = 'CELL'");
        const vilao = villainResult.recordset[0];

        res.json({ heroi, vilao });
    } catch (error) {
        console.error('Erro ao buscar dados do herói e do vilão:', error);
        res.status(500).json({ error: 'Erro ao buscar dados do herói e do vilão.' });
    }
});

// Rota para servir o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login/login.html'));
});

app.get('/jogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'jogo/jogo.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
});