const connection = require("../database/db");

class UsuarioModel {
    // Busca todos os usuários
    static async findAll() {
        const query = "SELECT * FROM Usuario ORDER BY id DESC";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Busca um usuário pelo ID
    static async findOne(userId) {
        const query = "SELECT * FROM Usuario WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }

    // Cria um novo usuário
    static async create(nome, senha, seguidores, dataCriacao) {
        const query = `
            INSERT INTO Usuario (nome, senha, seguidores, dataCriacao)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [nome, senha, seguidores, dataCriacao], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }

    // Atualiza um usuário existente
    static async update(userId, nome, senha, seguidores, dataCriacao) {
        const query = `
            UPDATE Usuario 
            SET nome = ?, senha = ?, seguidores = ?, dataCriacao = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [nome, senha, seguidores, dataCriacao, userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Remove um usuário
    static async delete(userId) {
        const query = "DELETE FROM Usuario WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [userId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = UsuarioModel;