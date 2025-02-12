const express = require("express");
const webUsuarioController = require("../controllers_web/WebUsuarioController");
const webpostController = require("../controllers_web/WebPostController");
const router = express.Router();
const connection = require("../db");

//SHOW para Post especifico
router.get("/post/:postId", (req, res) => {
    const postId = req.params.postId; // Obtém o ID do post da URL

    const query = "SELECT * FROM Post WHERE id = ?"; // Consulta para buscar o post pelo ID

    connection.query(query, [postId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o post:", err);
            return res.render("Post/show", { 
                layout: "Layouts/main", 
                post: { 
                    id: "Erro", 
                    album: "Erro ao carregar post.", 
                    texto: "Erro ao carregar post.", 
                    curtidas: 0, 
                    dataPostagem: new Date().toISOString().split("T")[0] 
                }, 
                message: ["danger", "Erro ao carregar o post."] 
            });
        }

        // Se encontrou o post, envia para o template de detalhes
        const post = results.length > 0 ? results[0] : { 
            id: "Nenhum post encontrado.", 
            album: "Nenhum post encontrado.", 
            texto: "Nenhum post encontrado.", 
            curtidas: 0, 
            dataPostagem: new Date().toISOString().split("T")[0] 
        };
        res.render("Post/show", { 
            layout: "Layouts/main", 
            post: post, 
            message: req.session.message || null 
        });
    });
});

//Mostra todos os POST
router.get("/post", (req, res) => {
    const query = "SELECT * FROM Post ORDER BY id DESC"; // Busca todos os posts, ordenados pelo ID decrescente

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar os posts:", err);
            return res.render("Post/index", { 
                layout: "Layouts/main", 
                title: "Postagens", 
                posts: [], 
                message: ["danger", "Erro ao carregar as postagens."] 
            });
        }

        // Se encontrou posts, envia para o template
        res.render("Post/index", { 
            layout: "Layouts/main", 
            title: "Postagens", 
            posts: results, 
            message: req.session.message || null 
        });
    });
});

//GET e EDIT para Post
router.get("/post/:postId/edit", async (req, res) => {
    const postId = req.params.postId; // Obtém o ID do post da URL

    const query = "SELECT * FROM Post WHERE id = ?"; // Consulta para buscar o post pelo ID

    connection.query(query, [postId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o post:", err);
            return res.render("Post/edit", {
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

        // Se encontrou o post, envia para o template de edição
        const post = results.length > 0 ? results[0] : {
            id: "Nenhum post encontrado.",
            album: "Nenhum post encontrado.",
            texto: "Nenhum post encontrado.",
            curtidas: 0,
            dataPostagem: new Date()
        };
        res.render("Post/edit", {
            layout: "Layouts/main",
            post: post
        });
    });
});

router.post("/post/:postId/edit", async (req, res) => {
    const postId = req.params.postId; // Obtém o ID do post da URL
    const { album, texto, curtidas, dataPostagem } = req.body; // Obtém os dados do formulário

    const query = `
        UPDATE Post 
        SET album = ?, texto = ?, curtidas = ?, dataPostagem = ?
        WHERE id = ?
    `; // Consulta para atualizar o post

    connection.query(query, [album, texto, curtidas, dataPostagem, postId], (err, results) => {
        if (err) {
            console.error("Erro ao atualizar o post:", err);
            return res.render("Post/edit", {
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

        // Redireciona para a página de detalhes do post após a edição
        res.redirect(`/post/${postId}`);
    });
});

//GET e CREATE para Post
router.get("/post/create", (req, res) => {
    res.render("Post/create", { 
        layout: "Layouts/main", 
        title: "Criar Novo Post" 
    });
});

router.post("/post", (req, res) => {
    const { album, texto, curtidas, dataPostagem, Usuario_id } = req.body; // Obtém os dados do formulário

    // Validação básica dos dados
    if (!album || !texto || !curtidas || !dataPostagem || Usuario_id) {
        req.session.message = ["danger", "Todos os campos são obrigatórios."];
        return res.redirect("/post/create");
    }

    const query = `
        INSERT INTO Post (album, texto, curtidas, dataPostagem, Usuario_id)
        VALUES (?, ?, ?, ?, ?)
    `; // Consulta para inserir um novo post

    connection.query(query, [album, texto, curtidas, dataPostagem, Usuario_id], (err, results) => {
        if (err) {
            console.error("Erro ao criar o post:", err);
            req.session.message = ["danger", "Erro ao criar o post."];
            return res.redirect("/post/create");
        }

        // Redireciona para a página de listagem de posts após a criação
        req.session.message = ["success", "Post criado com sucesso!"];
        res.redirect("/post");
    });
});

// Rota para mostrar detalhes de um usuário apenas
router.get("/usuario/:id", (req, res) => {
    const userId = req.params.id; // Obtém o ID do usuário da URL

    const query = "SELECT * FROM Usuario WHERE id = ?"; // Consulta o usuário pelo ID

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o usuário:", err);
            return res.render("Usuario/show", {
                layout: "Layouts/main",
                usuario: {
                    id: "Erro",
                    nome: "Erro ao carregar usuário.",
                    senha: "Erro ao carregar usuário.",
                    seguidores: 0,
                    dataCriacao: new Date().toISOString().split("T")[0]
                },
                message: ["danger", "Erro ao carregar o usuário."]
            });
        }

        // Se encontrou o usuário, envia para o template de detalhes
        const usuario = results.length > 0 ? results[0] : {
            id: "Nenhum usuário encontrado.",
            nome: "Nenhum usuário encontrado.",
            senha: "Nenhum usuário encontrado.",
            seguidores: 0,
            dataCriacao: new Date().toISOString().split("T")[0]
        };
        res.render("Usuario/show", {
            layout: "Layouts/main",
            usuario: usuario,
            message: req.session.message || null
        });
    });
});

//EDIT para USUARIO
router.get("/usuario/:id/edit", (req, res) => {
    const userId = req.params.id; // Obtém o ID do usuário da URL

    const query = "SELECT * FROM Usuario WHERE id = ?"; // Consulta o usuário pelo ID

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar o usuário:", err);
            return res.render("Usuario/edit", {
                layout: "Layouts/main",
                usuario: {
                    id: "Erro",
                    nome: "Erro ao carregar usuário.",
                    senha: "Erro ao carregar usuário.",
                    seguidores: 0,
                    dataCriacao: new Date()
                }
            });
        }

        // Se encontrou o usuário, envia para o template de edição
        const usuario = results.length > 0 ? results[0] : {
            id: "Nenhum usuário encontrado.",
            nome: "Nenhum usuário encontrado.",
            senha: "Nenhum usuário encontrado.",
            seguidores: 0,
            dataCriacao: new Date()
        };
        res.render("Usuario/edit", {
            layout: "Layouts/main",
            usuario: usuario
        });
    });
});

// Rota para processar a edição de um usuário (usando POST)
router.post("/usuario/:id/edit", (req, res) => {
    const userId = req.params.id; // Obtém o ID do usuário da URL
    const { nome, senha, seguidores, dataCriacao } = req.body; // Obtém os dados do formulário

    const query = `
        UPDATE Usuario 
        SET nome = ?, senha = ?, seguidores = ?, dataCriacao = ?
        WHERE id = ?
    `; // Consulta para atualizar o usuário

    connection.query(query, [nome, senha, seguidores, dataCriacao, userId], (err, results) => {
        if (err) {
            console.error("Erro ao atualizar o usuário:", err);
            return res.render("Usuario/edit", {
                layout: "Layouts/main",
                usuario: {
                    id: userId,
                    nome,
                    senha,
                    seguidores,
                    dataCriacao
                },
                message: ["danger", "Erro ao atualizar o usuário."]
            });
        }

        // Redireciona para a página de detalhes do usuário após a edição
        res.redirect(`/usuario/${userId}`);
    });
});

// Rota para excluir um usuário
router.post("/usuario/:id/delete", (req, res) => {
    const userId = req.params.id; // Obtém o ID do usuário da URL

    const query = "DELETE FROM Usuario WHERE id = ?"; // Consulta para excluir o usuário

    connection.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao excluir o usuário:", err);
            req.session.message = ["danger", "Erro ao excluir o usuário."];
            return res.redirect("/usuario");
        }

        // Redireciona para a página de listagem de usuários após a exclusão
        req.session.message = ["success", "Usuário excluído com sucesso."];
        res.redirect("/usuario");
    });
});

//Mostra todos os Usuarios
router.get("/usuario", (req, res) => {
    const query = "SELECT * FROM Usuario ORDER BY id DESC"; // Busca todos os Usuarios, ordenados pelo ID decrescente

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao buscar os usuarios:", err);
            return res.render("Usuario/index", { 
                layout: "Layouts/main", 
                title: "Usuario", 
                posts: [], 
                message: ["danger", "Erro ao carregar os usuarios."] 
            });
        }

        // Se encontrou usuarios, envia para o template
        res.render("Usuario/index", { 
            layout: "Layouts/main", 
            title: "Postagens", 
            posts: results, 
            message: req.session.message || null 
        });
    });
});

// Rotas de post
router.get("/post", webpostController.index);
router.get("/post/create", webpostController.create);
router.post("/post", webpostController.store);
router.get("/post/:postId", webpostController.show);
router.get("/post/:postId/edit", webpostController.edit);
router.put("/post/:postId", webpostController.update);
router.delete("/post/:postId", webpostController.destroy);

// Demais rotas ainda sem controlador (iremos criar um controlador para essas rotas no futuro)
router.get("/recurso", async (request, response) => {
    response.render("Recurso/index", { layout: "Layouts/main", title: "Recursos" });
});

router.get("/", async (request, response) => {
    response.render("index", { layout: "Layouts/main", title: "Página inicial" });
});
router.get("/Sobre", async (request, response) => {
    response.render("Sobre/index", { layout: "Layouts/main", title: "Sobre o Blog" });
});

router.get("/Nirvana", async (request, response) => {
    response.render("SobreAlbuns/Nirvana/index", { layout: "Layouts/main", title: "In Utero" });
});

router.get("/WuTang", async (request, response) => {
    response.render("SobreAlbuns/WuTang/index", { layout: "Layouts/main", title: "36 Chambers" });
});

router.get("/Bjork", async (request, response) => {
    response.render("SobreAlbuns/Bjork/index", { layout: "Layouts/main", title: "Debut" });
});

// Rotas de Autenticação
router.get("/usuario/login", webUsuarioController.loginForm);
router.post("/usuario/login", webUsuarioController.login);
router.post("/usuario/logout", webUsuarioController.logout);

// Rotas de Usuário
router.get("/usuario", webUsuarioController.index);
router.get("/usuario/create", webUsuarioController.create);
router.post("/usuario", webUsuarioController.store);
router.get("/usuario/:id", webUsuarioController.show);
router.get("/usuario/:id/edit", webUsuarioController.edit);
router.put("/usuario/:id", webUsuarioController.update);
router.delete("/usuario/:id", webUsuarioController.destroy);

module.exports = router;