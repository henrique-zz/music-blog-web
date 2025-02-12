const PostModel = require("../models/PostModel");

/**
 * Controlador para gerenciar posts através de endpoints da API.
 * @class
 */
class ApipostController {

    /**
     * Recupera todos os posts.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @returns {Promise<Object>} A resposta contendo todos os posts.
     */
    async apiGetAll(req, res) {
        try {
            const posts = await PostModel.findAll();
            return res.send(posts);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Recupera um único post pelo ID.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta contendo o post solicitado.
     */
    async apiGetOne(req, res) {
        try {
            const post = await PostModel.findOne(req.params.id);
            return res.send(post);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Armazena um novo post.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @returns {Promise<Object>} A resposta contendo o post armazenado.
     */
    async apiStore(req, res) {
        try {
            const post = new PostModel();
            post.album = req.body.post.album;
            post.texto = req.body.post.texto;
            post.curtidas = req.body.post.curtidas;
            post.dataPostagem = req.body.post.dataPostagem;
            post.id = req.body.post.id;
            const result = await post.save();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Atualiza um post existente.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta contendo o post atualizado.
     */
    async apiUpdate(req, res) {
        try {
            const post = await PostModel.findOne(req.params.id);
            post.album = req.body.post.album;
            post.texto = req.body.post.texto;
            post.curtidas = req.body.post.curtidas;
            post.dataPostagem = req.body.post.dataPostagem;
            post.id = req.body.post.id;
            const result = await post.update();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }

    /**
     * Exclui um post.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta indicando o status da exclusão.
     */
    async apiDestroy(req, res) {
        try {
            const post = await PostModel.findOne(req.params.id);
            const result = await post.delete();
            return res.send(result);
        } catch (error) {
            return res.send(error);
        }
    }
}

module.exports = new ApipostController();