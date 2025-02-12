const DataBase = require("../database/DataBase");

class PostModel {
    /** 
     * Os atributos da classe Model precisam ser correspondentes às colunas do banco de dados.
     */
    id = null;
    album = null;
    texto = null;
    curtidas = null;
    dataPostagem = null;
    Usuario_id = null;

    /**
     * Construtor da Classe PostModel
     * @param {post}     post     O objeto de entrada é simples (precisa conter apenas chave e valor, sem métodos) e precisa conter as chaves: id, album, texto, curtidas, dataPostagem e Usuario_id Esses campos são as colunas da tabela no banco de dados. Caso não passe um objeto com esses campos, um model vazio será criado.
     */
    constructor(post) {
        if (post &&
            "id" in post &&
            "album" in post &&
            "texto" in post &&
            "curtidas" in post &&
            "dataPostagem" in post &&
            "Usuario_id" in post
        ) {
            this.id = post.id;
            this.album = post.album;
            this.texto = post.texto;
            this.curtidas = post.curtidas;
            this.dataPostagem = post.dataPostagem;
            this.Usuario_id = post.Usuario_id;
        }
    }

    /**
     * Busca um objeto PostModel no banco de dados
     * @param  {Number}               id      ID do tipoProdudo a ser procurado no banco de dados.
     * @return {PostModel}             Retorna um objeto PostModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM post WHERE post.id = ?`, [id]);
        if (result && result.length == 1)
            return new PostModel(result[0]);
        return null;
    }

    /**
     * Busca todos objetos PostModel no banco de dados.
     * @return {[PostModel, ...]} Retorna um array com objetos PostModel que contém apenas as informações encontradas, caso não encontre, retorna um array vazio [].
     */
    static async findAll() {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM post`);
        if (result && result.length > 0) {
            // Transforma um array de post [post, ...] em uma array de PostModel [PostModel, ...]
            const modelArray = result.map(function (obj) {
                obj = new PostModel(obj);
                return obj;
            });
            return modelArray;
        }
        return [];
    }

    /**
     * Salva um objeto PostModel no banco de dados. O atributo que deve ser informado: "descricao". Os atributos: "id" "album" "texto" "curtidas" "dataPostagem" e "Usuario_id" são criados automaticamente.
     * @returns {PostModel} Retorna um objeto PostModel com as informações recém inseridas no banco de dados.
     */
    async save() {
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`INSERT INTO post VALUES (null, ?, ?, ?);`,
            [
                this.descricao,
                timestamp,
                timestamp
            ]
        );
        const tipoProduto = await TipoProdutoModel.findOne(result.insertId);
        return tipoProduto;
    }

    /**
     * Atualiza um objeto PostModel no banco de dados. O atributo que deve ser informado: "descricao". O atributo: "dataPostagem" é atualizado automaticamente. Os atributos: "id" e "dataCriacao" não são alterados.
     * @returns {PostModel} Retorna um objeto PostModel com as informações atualizadas no banco de dados.
     */
    async update() {
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`UPDATE post
                                                       SET texto = ?,
                                                           dataPostagem = ?
                                                       WHERE post.id = ?`,
            [
                this.texto,
                timestamp,
                this.id
            ]
        );
        const post = await PostModel.findOne(this.id);
        return post;
    }

    /**
     * Deleta um objeto PostModel no banco de dados.
     * @returns {PostModel} Retorna um objeto PostModel com as informações removidas banco de dados.
     */
    async delete() {
        const result = await DataBase.executeSQLQuery(`DELETE FROM post WHERE post.id = ?`, [this.id]);
        return this;
    }
}

module.exports = PostModel;
