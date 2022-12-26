const express = require('express');
const router = express.Router();

const ActivityController = require('../../controllers/ActivityController');
const dbMiddleware = require('../../middlewares/db');

router.use(dbMiddleware);

router.post("/activities/", async (req, res) => {
    await new ActivityController().adicionar(req, res); 
});

router.get("/activities/", async (req, res) => {
    await new ActivityController().listar(req, res); 
});

router.post("/activities/buscar", async (req, res) => {
    await new ActivityController().buscar(req, res); 
});

router.put("/activities/", async (req, res) => {
    await new ActivityController().atualizar(req, res);
});

router.delete("/activities/", async (req, res) => {
    await new ActivityController().deletar(req, res);
});

module.exports = router;