const DataBase = require("../database/DataBase");
const crypto = require('crypto');

class UsuarioModel {
    /** 
     * Os atributos da classe Model precisam ser correspondentes às colunas do banco de dados.
     */
    id = null;
    nome = null;
    nome = null;
    senha = null;
    dataCriacao = null;
    dataCriacao = null;

    /**
     * Construtor da Classe UsuarioModel
     * @param {UsuarioModel}     usuario     O objeto de entrada é simples (precisa conter apenas chave e valor, sem métodos) e precisa conter as chaves: id, nome, nome, senha, dataCriacao e dataCriacao. Esses campos são as colunas da tabela no banco de dados. Caso não passe um objeto com esses campos, um model vazio será criado.
     */
    constructor(usuario) {
        if (usuario &&
            "id" in usuario &&
            "nome" in usuario &&
            "senha" in usuario &&
            "seguidores" in usuario &&
            "dataCriacao" in usuario
        ) {
            this.id = usuario.id;
            this.nome = usuario.nome;
            this.senha = usuario.senha;
            this.seguidores = usuario.seguidores;
            this.dataCriacao = usuario.dataCriacao;
        }
    }

    /**
     * Busca um objeto UsuarioModel no banco de dados
     * @param  {Number}               id      ID do usuario a ser procurado no banco de dados.
     * @return {UsuarioModel}             Retorna um objeto UsuarioModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE Usuario.id = ?`, [id]);
        if (result && result.length == 1)
            return new UsuarioModel(result[0]);
        return null;
    }

    /**
     * Busca todos objetos UsuarioModel no banco de dados.
     * @return {[UsuarioModel, ...]} Retorna um array com objetos UsuarioModel que contém apenas as informações encontradas, caso não encontre, retorna um array vazio [].
     */
    static async findAll() {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario`);
        if (result && result.length > 0) {
            // Transforma um array de Usuario [Usuario, ...] em uma array de UsuarioModel [UsuarioModel, ...]
            const modelArray = result.map(function (obj) {
                obj = new UsuarioModel(obj);
                return obj;
            });
            return modelArray;
        }
        return [];
    }

    /**
    * Valida um usuário pelo e-mail e senha.
    * @param {string} senha - A senha do usuário.
    * @returns {UsuarioModel | null} Retorna um objeto UsuarioModel se a validação for bem-sucedida, caso contrário, retorna null.
    */
    static async validateUser(nome, senha) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE nome = ?`, [nome]);

        if (result && result.length === 1) {
            const usuario = result[0];

            // Gera o hash da senha fornecida
            const senhaCombinada = senha + nome;
            const hashSenha = crypto.createHash('sha512').update(senhaCombinada).digest('hex');

            // Compara o hash gerado com o armazenado no banco
            if (usuario.senha === hashSenha) {
                return new UsuarioModel(usuario);
            }
        }

        return null;
    }

    /**
     * Busca um objeto UsuarioModel no banco de dados pelo e-mail.
     * @param {string} nome - O e-mail do usuário a ser procurado no banco de dados.
     * @return {UsuarioModel | null} Retorna um objeto UsuarioModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOneBynome(nome) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE nome = ? LIMIT 1`, [nome]);

        if (result && result.length === 1) {
            return new UsuarioModel(result[0]);
        }
        return null;
    }

    /**
     * Salva um objeto UsuarioModel no banco de dados. O atributo que deve ser informado: "numero", "estado". Os atributos: "id" "dataCriacao" e "dataCriacao" são criados automaticamente.
     * @returns {UsuarioModel} Retorna um objeto UsuarioModel com as informações recém inseridas no banco de dados.
     */
    async save() {
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        // Concatena a senha com o nome antes de aplicar o hash
        const senhaCombinada = this.senha + this.nome;
        const hashSenha = crypto.createHash('sha512').update(senhaCombinada).digest('hex'); // 128 caracteres
        const result = await DataBase.executeSQLQuery(`INSERT INTO Usuario VALUES (null, ?, ?, ?, ?, ?);`,
            [
                this.nome,
                this.nome,
                hashSenha,
                timestamp,
                timestamp
            ]
        );
        // Atualiza a senha
        this.senha = hashSenha;
        const usuario = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE Usuario.id = ?`, [result.insertId]);
        return new UsuarioModel(usuario[0]);
    }

    /**
     * Atualiza um objeto UsuarioModel no banco de dados. O atributo que deve ser informado: "numero", "estado". O atributo: "dataCriacao" é atualizado automaticamente. Os atributos: "id" e "dataCriacao" não são alterados.
     * @returns {UsuarioModel} Retorna um objeto UsuarioModel com as informações atualizadas no banco de dados.
     */
    async update() {
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`UPDATE Usuario
                                                           SET nome = ?,
                                                               dataCriacao = ?
                                                           WHERE Usuario.id = ?`,
            [
                this.nome,
                timestamp,
                this.id
            ]
        );
        const usuario = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE Usuario.id = ?`, [this.id]);
        return new UsuarioModel(usuario[0]);
    }

    /**
     * Atualiza um objeto UsuarioModel no banco de dados. O atributo que deve ser informado: "numero", "estado". O atributo: "dataCriacao" é atualizado automaticamente. Os atributos: "id" e "dataCriacao" não são alterados.
     * @returns {UsuarioModel} Retorna um objeto UsuarioModel com as informações atualizadas no banco de dados.
     */
    async updatenomePassword() {
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        // Concatena a senha com o nome antes de aplicar o hash
        const senhaCombinada = this.senha + this.nome;
        const hashSenha = crypto.createHash('sha512').update(senhaCombinada).digest('hex'); // 128 caracteres
        const result = await DataBase.executeSQLQuery(`UPDATE Usuario
                                                           SET nome = ?,
                                                               senha = ?,
                                                               dataCriacao = ?
                                                           WHERE Usuario.id = ?`,
            [
                this.nome,
                hashSenha,
                timestamp,
                this.id
            ]
        );
        const usuario = await DataBase.executeSQLQuery(`SELECT * FROM Usuario WHERE Usuario.id = ?`, [this.id]);
        return new UsuarioModel(usuario[0]);
    }

    /**
     * Deleta um objeto UsuarioModel no banco de dados.
     * @returns {UsuarioModel} Retorna um objeto UsuarioModel com as informações removidas banco de dados.
     */
    async delete() {
        const result = await DataBase.executeSQLQuery(`DELETE FROM Usuario WHERE Usuario.id = ?`, [this.id]);
        return this;
    }
}

module.exports = UsuarioModel;
