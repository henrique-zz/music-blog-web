const UsuarioModel = require("../models/UsuarioModel");

class WebUsuarioController {
    // Mostra todos os usuários
    async index(req, res) {
        try {
            const usuarios = await UsuarioModel.findAll();
            res.render("Usuario/index", {
                layout: "Layouts/main",
                title: "Usuários",
                usuarios: usuarios, // Corrigido: passe 'usuarios' em vez de 'posts'
                message: req.session.message || null,
            });
        } catch (error) {
            console.error("Erro ao buscar os usuários:", error);
            res.render("Usuario/index", {
                layout: "Layouts/main",
                title: "Usuários",
                usuarios: [], // Corrigido: passe 'usuarios' em vez de 'posts'
                message: ["danger", "Erro ao carregar os usuários."],
            });
        }
    }

    // Mostra o formulário para criar um novo usuário
    async create(req, res) {
        res.render("Usuario/create", {
            layout: "Layouts/main",
            title: "Criar Novo Usuário",
        });
    }

    // Salva um novo usuário no banco de dados
    async store(req, res) {
        const { nome, senha, seguidores, dataCriacao } = req.body;

        if (!nome || !senha || !seguidores || !dataCriacao) {
            req.session.message = ["danger", "Todos os campos são obrigatórios."];
            return res.redirect("/usuario/create");
        }

        try {
            await UsuarioModel.create(nome, senha, seguidores, dataCriacao);
            req.session.message = ["success", "Usuário criado com sucesso!"];
            res.redirect("/usuario");
        } catch (error) {
            console.error("Erro ao criar o usuário:", error);
            req.session.message = ["danger", "Erro ao criar o usuário."];
            res.redirect("/usuario/create");
        }
    }

    // Mostra os detalhes de um usuário específico
    async show(req, res) {
        const userId = req.params.id;

        try {
            const usuario = await UsuarioModel.findOne(userId);
            res.render("Usuario/show", {
                layout: "Layouts/main",
                usuario: usuario || {
                    id: "Nenhum usuário encontrado.",
                    nome: "Nenhum usuário encontrado.",
                    senha: "Nenhum usuário encontrado.",
                    seguidores: 0,
                    dataCriacao: new Date().toISOString().split("T")[0],
                },
                message: req.session.message || null,
            });
        } catch (error) {
            console.error("Erro ao buscar o usuário:", error);
            res.render("Usuario/show", {
                layout: "Layouts/main",
                usuario: {
                    id: "Erro",
                    nome: "Erro ao carregar usuário.",
                    senha: "Erro ao carregar usuário.",
                    seguidores: 0,
                    dataCriacao: new Date().toISOString().split("T")[0],
                },
                message: ["danger", "Erro ao carregar o usuário."],
            });
        }
    }

    // Mostra o formulário para editar um usuário
    async edit(req, res) {
        const userId = req.params.id;
    
        try {
            const usuario = await UsuarioModel.findOne(userId);
            res.render("Usuario/edit", {
                layout: "Layouts/main",
                title: "Editar Usuário",
                usuario: usuario || {
                    id: "Nenhum usuário encontrado.",
                    nome: "Nenhum usuário encontrado.",
                    senha: "Nenhum usuário encontrado.",
                    seguidores: 0,
                    dataCriacao: new Date().toISOString().split("T")[0],
                },
                message: req.session.message || null,
            });
        } catch (error) {
            console.error("Erro ao buscar o usuário:", error);
            res.render("Usuario/edit", {
                layout: "Layouts/main",
                title: "Editar Usuário",
                usuario: {
                    id: "Erro",
                    nome: "Erro ao carregar usuário.",
                    senha: "Erro ao carregar usuário.",
                    seguidores: 0,
                    dataCriacao: new Date().toISOString().split("T")[0],
                },
                message: ["danger", "Erro ao carregar o usuário."],
            });
        }
    }

    // Atualiza um usuário existente
    async update(req, res) {
        const userId = req.params.id;
        const { nome, senha, seguidores, dataCriacao } = req.body;
    
        try {
            await UsuarioModel.update(userId, nome, senha, seguidores, dataCriacao);
            req.session.message = ["success", "Usuário atualizado com sucesso!"];
            res.redirect(`/usuario/${userId}`);
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            req.session.message = ["danger", "Erro ao atualizar o usuário."];
            res.redirect(`/usuario/${userId}/edit`);
        }
    }

    // Remove um usuário
    async destroy(req, res) {
        const userId = req.params.id;
    
        try {
            await UsuarioModel.delete(userId);
            req.session.message = ["success", "Usuário excluído com sucesso."];
            res.redirect("/usuario");
        } catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            req.session.message = ["danger", "Erro ao excluir o usuário."];
            res.redirect("/usuario");
        }
    }
}

module.exports = new WebUsuarioController();