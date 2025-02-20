const connection = require("../database/db");
const bcrypt = require('bcrypt');
const saltRounds = 10;


class UsuarioModel {

    static async findByCredentials(nome) {
        const query = 'SELECT * FROM Usuario WHERE nome = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [nome], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]); // Retorna o primeiro usuário encontrado
                }
            });
        });
    }
    
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
        const hashedSenha = await bcrypt.hash(senha, saltRounds); // Criptografa a senha
        const query = `
            INSERT INTO Usuario (nome, senha, seguidores, dataCriacao)
            VALUES (?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [nome, hashedSenha, seguidores, dataCriacao], (err, results) => {
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
        let query;
        const params = [nome, seguidores, dataCriacao, userId];

        if (senha) {
            const hashedSenha = await bcrypt.hash(senha, saltRounds); // Criptografa a senha
            query = `
                UPDATE Usuario 
                SET nome = ?, senha = ?, seguidores = ?, dataCriacao = ?
                WHERE id = ?
            `;
            params.splice(1, 0, hashedSenha); // Substitui a senha criptografada na posição correta
        } else {
            query = `
                UPDATE Usuario 
                SET nome = ?, seguidores = ?, dataCriacao = ?
                WHERE id = ?
            `;
        }

        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
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

    // Verifica a senha
    static async verifyPassword(storedPassword, inputPassword) {
        return bcrypt.compare(inputPassword, storedPassword); // Verifica se a senha criptografada corresponde à informada
    }
}

module.exports = UsuarioModel;