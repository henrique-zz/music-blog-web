const express = require("express");
const apiUsuarioController = require("../controllers_api/ApiUsuarioController");
const apipostController = require("../controllers_api/ApipostController");
const router = express.Router();

// Rotas de post
router.get("/api/post", apipostController.apiGetAll); // Devolver todos os posts no formato JSON
router.get("/api/post/:postId", apipostController.apiGetOne); // Devolver um post no formato JSON
router.post("/api/post", apipostController.apiStore); // Armazenar um post
router.put("/api/post/:postId", apipostController.apiUpdate); // Atualizar um post
router.delete("/api/post/:postId", apipostController.apiDestroy); // Remover um post

// Rotas de Usuario
router.get("/api/Usuario", apiUsuarioController.apiGetAll); // Devolver todos os Usuarios no formato JSON
router.get("/api/Usuario/:UsuarioId", apiUsuarioController.apiGetOne); // Devolver um Usuario no formato JSON
router.post("/api/Usuario", apiUsuarioController.apiStore); // Armazenar um Usuario
router.put("/api/Usuario/:UsuarioId", apiUsuarioController.apiUpdate); // Atualizar um Usuario
router.delete("/api/Usuario/:UsuarioId", apiUsuarioController.apiDestroy); // Remover um Usuario



module.exports = router;