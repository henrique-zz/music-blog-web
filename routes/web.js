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

// Rotas de post
router.get("/post", webpostController.index);
router.get("/post/create", webpostController.create);
router.post("/post", webpostController.store);
router.get("/post/:postId", webpostController.show);
router.get("/post/:postId/edit", webpostController.edit);
router.post("/post/:postId/edit", webpostController.update);
router.delete("/post/:postId", webpostController.destroy);

// Rotas de Autenticação
router.get("/usuario/login", webUsuarioController.loginForm);
router.post("/usuario/login", webUsuarioController.login);
router.post("/usuario/logout", webUsuarioController.logout);

// Rotas de registro
router.get("/usuario/register", webUsuarioController.registerForm);
router.post("/usuario/register", webUsuarioController.register)

router.get("/usuario", webUsuarioController.index);
router.get("/usuario/create", webUsuarioController.create);
router.post("/usuario", webUsuarioController.store);
router.get("/usuario/:id", webUsuarioController.show);
router.get("/usuario/:id/edit", webUsuarioController.edit);
router.post("/usuario/:id/edit", webUsuarioController.update);
router.delete("/usuario/:id", webUsuarioController.destroy);

module.exports = router;