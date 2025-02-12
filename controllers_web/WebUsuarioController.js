const UsuarioModel = require("../models/UsuarioModel.js");

class WebUsuarioController {
    /**
     * Mostra o painel do usuário logado
     */

    async index(req, res) {
        try {
            const message = req.session.message ? req.session.message : null;
            if (message) delete req.session.message;
            const usuarioLogado = req.session.usuario || null; // Obtém os dados do usuário logado
            const usuario = usuarioLogado ? await UsuarioModel.findOne(usuarioLogado.id) : null;
            return res.render("Usuario/index", {
                layout: "Layouts/main",
                title: "Lista de Usuários",
                usuario: usuario,
                message: message,
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            return res.render("Usuario/index", {    
                layout: "Layouts/main",
                title: "Lista de Usuários",
                usuario: null,
                message: ["danger", JSON.stringify(error)]
            });
        }
    }

    /**
     * Mostra o formulário de criação de usuário.
     */
    async create(req, res) {
        try {
            return res.render("Usuario/create", {
                layout: "Layouts/main",
                title: "Criar Usuário",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Salva um novo usuário no banco de dados.
     */
    async store(req, res) {
        try {
            const { nome, senha } = req.body;


            if (!nome || !senha) {
                req.session.message = ["warning", "Todos os campos são obrigatórios."];
                return res.redirect("/usuario/create");
            }

            const usuarioExistente = await UsuarioModel.findOneByNome(nome);
            if (usuarioExistente) {
                req.session.message = ["warning", "Nome já cadastrado."];
                return res.redirect("/usuario/create");
            }

            const usuario = new UsuarioModel();
            usuario.nome = nome;
            usuario.senha = senha;
            await usuario.save();

            req.session.message = ["success", "Usuário cadastrado com sucesso."];
            return res.redirect("/usuario");
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Mostra detalhes de um usuário.
     */
    async show(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (usuario) {
                return res.render("Usuario/show", {
                    layout: "Layouts/main",
                    title: "Detalhes do Usuário",
                    usuario: usuario
                });
            }
            req.session.message = ["warning", "Usuário não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Mostra o formulário de edição de usuário.
     */
    async edit(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (usuario) {
                return res.render("Usuario/edit", {
                    layout: "Layouts/main",
                    title: "Editar Usuário",
                    usuario: usuario,
                    csrfToken: req.csrfToken()
                });
            }
            req.session.message = ["warning", "Usuário não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Mostra o formulário de edição de usuário.
     */
    async editNomePassword(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (usuario) {
                return res.render("Usuario/editNomePassword", {
                    layout: "Layouts/main",
                    title: "Editar Usuário",
                    usuario: usuario,
                    csrfToken: req.csrfToken()
                });
            }
            req.session.message = ["warning", "Usuário não encontrado."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Atualiza um usuário existente.
     */
    async update(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }

            usuario.nome = req.body.nome;

            await usuario.update();

            // Atualiza session
            req.session.usuario = { id: usuario.id, nome: usuario.nome };

            req.session.message = ["success", `Usuário ${usuario.id} atualizado com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Atualiza um usuário existente.
     */
    async updateNomePassword(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }

            usuario.nome = req.body.nome;
            usuario.senha = req.body.senha;

            await usuario.updateNomePassword();

            // Remove a session para forçar um novo login
            delete req.session.usuario;

            req.session.message = ["success", `Usuário ${usuario.id} atualizado com sucesso.`];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Remove um usuário.
     */
    async destroy(req, res) {
        try {
            const usuario = await UsuarioModel.findOne(req.params.id);
            if (!usuario) {
                req.session.message = ["warning", "Usuário não encontrado."];
                return res.redirect("/usuario");
            }

            await usuario.delete();
            req.session.message = ["success", "Usuário removido com sucesso."];
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Mostra o formulário de login.
     */
    async loginForm(req, res) {
        try {
            return res.render("Usuario/login", {
                layout: "Layouts/main",
                title: "Login de usuário",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Processa o login do usuário.
     */
    async login(req, res) {
        try {
            const { nome, senha } = req.body;

            if (!nome || !senha) {
                req.session.message = ["warning", "Nome e senha são obrigatórios."];
                return res.redirect("/usuario");
            }

            const usuario = await UsuarioModel.validateUser(nome, senha);
            if (!usuario) {
                req.session.message = ["danger", "Nome ou senha inválidos."];
                return res.redirect("/usuario");
            }

            req.session.usuario = { id: usuario.id, nome: usuario.nome };
            req.session.message = ["success", `Bem-vindo, ${usuario.nome}!`];
            return res.redirect("/usuario");
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    /**
     * Faz o logout do usuário.
     */
    async logout(req, res) {
        try {
            delete req.session.usuario;
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }
}

module.exports = new WebUsuarioController();
