const UsuarioModel = require("../models/UsuarioModel");
const bcrypt = require('bcrypt');


class WebUsuarioController {

    registerForm(req, res) {
        res.render("Usuario/register", {
            layout: "Layouts/main",
            title: "Criar Conta",
            message: req.session.message || null,
        });
    }

    // Processa o registro de um novo usuário
    async register(req, res) {
        const { nome, senha } = req.body;
    
        try {
            // Verifica se o usuário já existe
            const usuarioExistente = await UsuarioModel.findByCredentials(nome); // Apenas o nome é necessário
            if (usuarioExistente) {
                req.session.message = ["danger", "Usuário já existe!"];
                return res.redirect("/usuario/register");
            }
    
            // Cria um novo usuário
            await UsuarioModel.create(nome, senha, 0, new Date().toISOString().split("T")[0]); // Adicione valores padrão para seguidores e dataCriacao
            req.session.message = ["success", "Conta criada com sucesso! Faça login."];
            res.redirect("/usuario/login");
        } catch (error) {
            console.error("Erro ao criar conta:", error);
            req.session.message = ["danger", "Erro ao criar conta."];
            res.redirect("/usuario/register");
        }
    }

    // Exibe o formulário de login
    loginForm(req, res) {
        res.render("Usuario/login", {
            layout: "Layouts/main",
            title: "Login",
            message: req.session.message || null,
        });
    }

    // Processa o login
    async login(req, res) {
        const { nome, senha } = req.body;
    
        try {
            // Encontre o usuário pelo nome
            const usuario = await UsuarioModel.findByCredentials(nome);
    
            if (usuario) {
                // Compare a senha fornecida com a senha armazenada
                const senhaValida = await bcrypt.compare(senha, usuario.senha);
    
                if (senhaValida) {
                    // Se as senhas coincidem, realiza o login
                    req.session.usuarioId = usuario.id;
                    req.session.usuarioNome = usuario.nome;
                    req.session.message = ["success", "Login realizado com sucesso!"];
                    res.redirect("/");
                } else {
                    // Senha inválida
                    req.session.message = ["danger", "Credenciais inválidas."];
                    res.redirect("/usuario/login");
                }
            } else {
                // Usuário não encontrado
                req.session.message = ["danger", "Credenciais inválidas."];
                res.redirect("/usuario/login");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            req.session.message = ["danger", "Erro ao fazer login."];
            res.redirect("/usuario/login");
        }
    }
    
    

    // Processa o logout
    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Erro ao fazer logout:", err);
                return res.redirect("/");
            }
            res.locals.usuarioId = null; // Garante que não há usuário na sessão
            res.redirect("/usuario/login");
        });
    }



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

        if (req.session.usuarioId != userId) {
            req.session.message = ["danger", "Você só pode editar seu próprio perfil!"];
            return res.redirect("/usuario");
        }

        try {
            const usuario = await UsuarioModel.findOne(userId);
            res.render("Usuario/edit", {
                layout: "Layouts/main",
                title: "Editar Usuário",
                usuario,
                message: req.session.message || null,
            });
        } catch (error) {
            console.error("Erro ao buscar o usuário:", error);
            req.session.message = ["danger", "Erro ao carregar o usuário."];
            res.redirect("/usuario");
        }
    }


    // Atualiza um usuário existente
    async update(req, res) {
        const userId = req.params.id;
        const { nome, senha, seguidores, dataCriacao } = req.body;

        if (req.session.usuarioId != userId) {
            req.session.message = ["danger", "Você só pode editar seu próprio perfil!"];
            return res.redirect("/usuario");
        }

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

        // Verifica se o usuário está tentando excluir sua própria conta
        if (req.session.usuarioId != userId) {
            req.session.message = ["danger", "Você só pode excluir seu próprio perfil!"];
            return res.redirect("/usuario");
        }

        try {
            // Exclui o usuário do banco de dados
            await UsuarioModel.delete(userId);

            // Antes de destruir a sessão, defina a mensagem
            req.session.message = ["success", "Usuário excluído com sucesso."];

            // Agora, destrua a sessão e redirecione
            req.session.destroy((err) => {
                if (err) {
                    console.error("Erro ao destruir a sessão:", err);
                    return res.redirect("/usuario");
                }
                res.locals.usuarioId = null; // Garantir que não há usuário na sessão
                res.redirect("/usuario/login");  // Redireciona para a página de login
            });
        } catch (error) {
            console.error("Erro ao excluir o usuário:", error);
            req.session.message = ["danger", "Erro ao excluir o usuário."];
            res.redirect("/usuario");
        }
    }



}

module.exports = new WebUsuarioController();