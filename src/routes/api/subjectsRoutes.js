const express = require('express');
const router = express.Router();

const SubjectController = require('../../controllers/SubjectController');

const dbMiddleware = require('../../middlewares/db');

router.use(dbMiddleware);

router.get("/subjects/", async (req, res) => {
    await new SubjectController().listar(req, res);
});

router.post("/subjects/buscar", async (req, res) => {
    await new SubjectController().buscar(req, res);
});

router.post("/subjects/", async (req, res) => {
    await new SubjectController().adicionar(req, res); 
});

router.delete("/subjects/", async (req, res) => {
    await new SubjectController().deletar(req, res); 
});

router.put("/subjects/", async (req, res) => {
    await new SubjectController().atualizar(req, res); 
});


module.exports = router;