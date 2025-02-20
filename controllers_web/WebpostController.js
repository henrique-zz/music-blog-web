const PostModel = require("../models/PostModel");

class WebPostController {
    // Mostra todos os posts
    async index(req, res) {
        try {
            const posts = await PostModel.findAll();
            res.render("Post/index", { 
                layout: "Layouts/main", 
                title: "Postagens", 
                posts, 
                message: req.session.message || null 
            });
        } catch (error) {
            console.error("Erro ao buscar os posts:", error);
            res.render("Post/index", { 
                layout: "Layouts/main", 
                title: "Postagens", 
                posts: [], 
                message: ["danger", "Erro ao carregar as postagens."] 
            });
        }
    }

    // Mostra o formulário para criar um novo post
    async create(req, res) {
        res.render("Post/create", { 
            layout: "Layouts/main", 
            title: "Criar Novo Post" 
        });
    }

    // Salva um novo post no banco de dados
    async store(req, res) {
        const { album, texto, curtidas, dataPostagem } = req.body;
        const Usuario_id = req.session.usuarioId; // Obtém o ID do usuário logado

        if (!album || !texto || !curtidas || !dataPostagem) {
            req.session.message = ["danger", "Todos os campos são obrigatórios."];
            return res.redirect("/post/create");
        }

        try {
            await PostModel.create(album, texto, curtidas, dataPostagem, Usuario_id);
            req.session.message = ["success", "Post criado com sucesso!"];
            res.redirect("/post");
        } catch (error) {
            console.error("Erro ao criar o post:", error);
            req.session.message = ["danger", "Erro ao criar o post."];
            res.redirect("/post/create");
        }
    }

    // Mostra um post específico
    async show(req, res) {
        const postId = req.params.postId;

        try {
            const post = await PostModel.findOne(postId);
            res.render("Post/show", { 
                layout: "Layouts/main", 
                post: post || { 
                    id: "Nenhum post encontrado.", 
                    album: "Nenhum post encontrado.", 
                    texto: "Nenhum post encontrado.", 
                    curtidas: 0, 
                    dataPostagem: new Date().toISOString().split("T")[0] 
                }, 
                message: req.session.message || null 
            });
        } catch (error) {
            console.error("Erro ao buscar o post:", error);
            res.render("Post/show", { 
                layout: "Layouts/main", 
                post: { 
                    id: "Erro", 
                    album: "Erro ao carregar post.", 
                    texto: "Erro ao carregar post.", 
                    curtidas: 0, 
                    dataPostagem: new Date() 
                }, 
                message: ["danger", "Erro ao carregar o post."] 
            });
        }
    }

    // Mostra o formulário para editar um post
    async edit(req, res) {
        const postId = req.params.postId;
        const usuarioLogadoId = req.session.usuarioId;

        try {
            const post = await PostModel.findOne(postId);

            if (!post) {
                return res.status(404).send("Post não encontrado.");
            }

            if (post.Usuario_id !== usuarioLogadoId) {
                return res.status(403).send("Você não tem permissão para editar este post.");
            }

            res.render("Post/edit", { 
                layout: "Layouts/main", 
                post 
            });
        } catch (error) {
            console.error("Erro ao buscar o post:", error);
            res.render("Post/edit", { 
                layout: "Layouts/main", 
                post: { 
                    id: "Erro", 
                    album: "Erro ao carregar post.", 
                    texto: "Erro ao carregar post.", 
                    curtidas: 0, 
                    dataPostagem: new Date() 
                } 
            });
        }
    }

    // Atualiza um post existente
    async update(req, res) {
        const postId = req.params.postId;
        const usuarioLogadoId = req.session.usuarioId;
        const { album, texto, curtidas, dataPostagem } = req.body;

        try {
            const post = await PostModel.findOne(postId);

            if (!post) {
                return res.status(404).send("Post não encontrado.");
            }

            if (post.Usuario_id !== usuarioLogadoId) {
                return res.status(403).send("Você não tem permissão para editar este post.");
            }

            await PostModel.update(postId, album, texto, curtidas, dataPostagem);
            res.redirect(`/post/${postId}`);
        } catch (error) {
            console.error("Erro ao atualizar o post:", error);
            res.render("Post/edit", { 
                layout: "Layouts/main", 
                post: { 
                    id: postId, 
                    album, 
                    texto, 
                    curtidas, 
                    dataPostagem 
                }, 
                message: ["danger", "Erro ao atualizar o post."] 
            });
        }
    }

    // Remove um post
    async destroy(req, res) {
        const postId = req.params.postId;
        const usuarioLogadoId = req.session.usuarioId;

        try {
            const post = await PostModel.findOne(postId);

            if (!post) {
                return res.status(404).send("Post não encontrado.");
            }

            if (post.Usuario_id !== usuarioLogadoId) {
                return res.status(403).send("Você não tem permissão para excluir este post.");
            }

            await PostModel.delete(postId);
            req.session.message = ["success", "Post excluído com sucesso."];
            res.redirect("/post");
        } catch (error) {
            console.error("Erro ao excluir o post:", error);
            req.session.message = ["danger", "Erro ao excluir o post."];
            res.redirect("/post");
        }
    }
}

module.exports = new WebPostController();
