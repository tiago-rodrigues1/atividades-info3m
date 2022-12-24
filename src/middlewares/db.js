const express = require('express');
const router = express.Router();
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

router.use(async (req, res, next) => {
    const { MONGODB_URL } = process.env;

    const client = new MongoClient(MONGODB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1
        });

    try {
        const database = client.db("info3m");
        req.db = database;

        next();
    } catch (e) {
        console.error(e);

        return res.status(500).json({ message: "error in database connection" });
    }
});

module.exports = router;

