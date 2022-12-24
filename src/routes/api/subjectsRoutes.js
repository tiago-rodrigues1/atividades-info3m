const express = require('express');
const router = express.Router();

const SubjectController = require('../../controllers/SubjectController');

const dbMiddleware = require('../../middlewares/db');

router.use(dbMiddleware);

router.get("/materias/", async (req, res) => {
    await new SubjectController().listar(req, res);
});

router.post("/materias/buscar", async (req, res) => {
    await new SubjectController().buscar(req, res);
});

router.post("/materias/", async (req, res) => {
    await new SubjectController().adicionar(req, res); 
});

router.delete("/materias/", async (req, res) => {
    await new SubjectController().deletar(req, res); 
});

router.put("/materias/", async (req, res) => {
    await new SubjectController().atualizar(req, res); 
});


module.exports = router;