const UsuarioModel = require("../../models/UsuarioModel");

/**
 * Controlador para gerenciar usuarios através de endpoints da API.
 * @class
 */
class ApiUsuarioController {

    /**
     * Recupera todos os usuarios.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resUsuarioa do Express.
     * @returns {Promise<Object>} A resUsuarioa contendo todos os usuarios.
     */
    async apiGetAll(req, res) {
        try {
            const usuarios = await UsuarioModel.findAll();
            return res.send(usuarios);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Recupera um único usuario pelo ID.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resUsuarioa do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resUsuario contendo o usuario solicitado.
     */
    async apiGetOne(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            return res.send(usuario);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Armazena um novo usuario.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resUsuarioa do Express.
     * @returns {Promise<Object>} A resUsuarioa contendo o usuario armazenado.
     */
    async apiStore(req, res) {
        try {
            const usuario = new UsuarioModel();
            usuario.nome = req.body.usuario.nome;
            usuario.senha = req.body.usuario.senha;
            usuario.seguidores = req.body.usuario.seguidores;
            usuario.dataCriacao = req.body.usuario.dataCriacao;
            usuario.id = req.body.usuario.id;
            const result = await usuario.save();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Atualiza um usuario existente.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resUsuarioa do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resUsuarioa contendo o usuario atualizado.
     */
    async apiUpdate(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            usuario.nome = req.body.usuario.nome;
            usuario.senha = req.body.usuario.senha;
            usuario.seguidores = req.body.usuario.seguidores;
            usuario.dataCriacao = req.body.usuario.dataCriacao;
            usuario.id = req.body.usuario.id;
            const result = await usuario.update();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Exclui um usuario.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resUsuarioa do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resUsuarioa indicando o status da exclusão.
     */
    async apiDestroy(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            const result = await usuario.delete();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }
}

module.exports = new ApiUsuarioController();