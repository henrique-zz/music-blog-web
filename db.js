const mysql = require("mysql2");
const config = require("config"); // Importa as configurações

// Obtém as configurações do banco de dados a partir do default.json
const dbConfig = config.get("db");

// Cria a conexão com os parâmetros do arquivo default.json
const connection = mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error("❌ Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("✅ Conectado ao banco de dados MySQL!");
});

module.exports = connection;
