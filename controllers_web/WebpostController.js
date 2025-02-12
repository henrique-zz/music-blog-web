const async = require("hbs/lib/async");
const PostModel = require("../models/PostModel");

class WebPostController {
    /**
    * Mostra uma tela com todos os recursos
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    */
    async index(req, res) {
        res.send( await PostModel.findAll());
        // const posts = await PostModel.findAll(); // Busca todos os posts
        // res.render("post/index", { posts });
        
    }

    /**
    * Mostra um formulário para criação de um novo recurso
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    */
    async create(req, res) {
        res.render("post/create");
    }

    /**
    * Salva um novo recurso no banco de dados
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    */
    async store(req, res) {
        try {
            const post = new PostModel();
            post.album = req.body.album || null; // Se req.body.album for undefined, usa null
            post.texto = req.body.texto || null; // Se req.body.texto for undefined, usa null
            post.curtidas = req.body.curtidas || 0; // Se req.body.curtidas for undefined, usa 0 (ou null, se preferir)
            post.dataPostagem = req.body.dataPostagem || new Date(); // Se req.body.dataPostagem for undefined, usa a data atual
            await post.save(); // Salva o novo post no banco de dados
            res.redirect("/post"); // Redireciona para a lista de posts
        } catch (error) {
            res.status(500).send("Erro ao salvar o post: " + error.message);
        }
    }



    /**
    * Mostra um recurso específico
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    * @param {Number} req.params.tipoProdutoId Parâmetro passado pela rota do express
    */

    async show(req, res) {
        try {
            const post = await PostModel.findOne(req.params.postId); // Busca o post pelo ID
            res.render("post/show", { post }); // Renderiza o template com os detalhes do post
        } catch (error) {
            res.status(500).send("Erro ao buscar o post: " + error.message);
        }
    }

    /**
    * Mostra um formulário para editar um recurso específico
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    * @param {Number} req.params.tipoProdutoId Parâmetro passado pela rota do express
    */
    async edit(req, res) {
        try {
            const post = await PostModel.findOne(req.params.postId); // Busca o post pelo ID
            res.render("post/edit", { post }); // Renderiza o formulário de edição
        } catch (error) {
            res.status(500).send("Erro ao buscar o post: " + error.message);
        }
    }

    /**
    * Atualiza um recurso existente no banco de dados
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    * @param {Number} req.params.tipoProdutoId Parâmetro passado pela rota do express
    */
    async update(req, res) {
        try {
            const post = await PostModel.findOne(req.params.postId); // Busca o post pelo ID
            post.album = req.body.album;
            post.texto = req.body.texto;
            post.curtidas = req.body.curtidas;
            post.dataPostagem = req.body.dataPostagem;
            await post.update(); // Atualiza o post no banco de dados
            res.redirect("/post"); // Redireciona para a lista de posts
        } catch (error) {
            res.status(500).send("Erro ao atualizar o post: " + error.message);
        }
    }

    /**
    * Remove um recurso existente do banco de dados
    * @param {*} req Requisição da rota do express
    * @param {*} res Resposta da rota do express
    * @param {Number} req.params.tipoProdutoId Parâmetro passado pela rota do express
    */
    async destroy(req, res) {
        try {
            const post = await PostModel.findOne(req.params.postId); // Busca o post pelo ID
            await post.delete(); // Remove o post do banco de dados
            res.redirect("/post"); // Redireciona para a lista de posts
        } catch (error) {
            res.status(500).send("Erro ao remover o post: " + error.message);
        }
    }
}


module.exports = new WebPostController();