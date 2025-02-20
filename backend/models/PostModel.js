const connection = require("../database/db");

class PostModel {
    // Busca todos os posts
    static async findAll() {
        const query = "SELECT * FROM Post ORDER BY id DESC";
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

    // Busca um post pelo ID
    static async findOne(postId) {
        const query = "SELECT * FROM Post WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [postId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }

    // Cria um novo post
    static async create(album, texto, curtidas, dataPostagem, Usuario_id) {
        const query = `
            INSERT INTO Post (album, texto, curtidas, dataPostagem, Usuario_id)
            VALUES (?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            connection.query(query, [album, texto, curtidas, dataPostagem, Usuario_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId);
                }
            });
        });
    }

    // Atualiza um post existente
    static async update(postId, album, texto, curtidas, dataPostagem) {
        const query = `
            UPDATE Post 
            SET album = ?, texto = ?, curtidas = ?, dataPostagem = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            connection.query(
                query,
                [album, texto, curtidas, dataPostagem, postId],
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                }
            );
        });
    }

    // Remove um post
    static async delete(postId) {
        const query = "DELETE FROM Post WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [postId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = PostModel;