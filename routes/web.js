const express = require("express");
const router = express.Router();
const webUsuarioController = require("../controllers_web/WebUsuarioController");
const webpostController = require("../controllers_web/WebPostController");
const connection = require("../database/db");

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

// Middleware para verificar se o usuário está logado
function isAuthenticated(req, res, next) {
    if (req.session.usuarioId) {
        return next(); // Usuário logado, segue para a rota
    } else {
        req.session.message = ["danger", "Você precisa estar logado para acessar essa página."];
        return res.redirect("/usuario/login"); // Redireciona para o login se não estiver logado
    }
}


// Rotas de post
router.get("/post", webpostController.index);
router.get("/post/create", isAuthenticated, webpostController.create);
router.post("/post", isAuthenticated, webpostController.store);
router.get("/post/:postId", isAuthenticated, webpostController.show);
router.get("/post/:postId/edit", isAuthenticated, webpostController.edit);
router.post("/post/:postId/edit", isAuthenticated, webpostController.update);
router.delete("/post/:postId", isAuthenticated, webpostController.destroy);

// Rotas de Autenticação
router.get("/usuario/login", webUsuarioController.loginForm);
router.post("/usuario/login", webUsuarioController.login);
router.get("/usuario/logout", webUsuarioController.logout);
router.post("/usuario/logout", webUsuarioController.logout);

// Rotas de registro
router.get("/usuario/register", webUsuarioController.registerForm);
router.post("/usuario/register", webUsuarioController.register)

router.get("/usuario", webUsuarioController.index);
router.get("/usuario/create", isAuthenticated, webUsuarioController.create);
router.post("/usuario", isAuthenticated, webUsuarioController.store);
router.get("/usuario/:id", isAuthenticated, webUsuarioController.show);
router.get("/usuario/:id/edit", isAuthenticated, webUsuarioController.edit);
router.post("/usuario/:id/edit", isAuthenticated, webUsuarioController.update);
router.delete("/usuario/:id", isAuthenticated, webUsuarioController.destroy);

module.exports = router;