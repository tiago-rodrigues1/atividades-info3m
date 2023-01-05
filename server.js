const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;

const subjectRoutes = require('./src/routes/api/subjectsRoutes');
const activitiesRoutes = require('./src/routes/api/activitiesRoutes');

const cacheMiddleware = require('./src/middlewares/cache');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use("/api", subjectRoutes);
app.use("/api", activitiesRoutes);

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    res.render("pages/index", { data: null });
});

app.get("/app", cacheMiddleware, (req, res) => {
    try {
        let data = {};

        data.activities = req.activities;
        data.subjects = req.subjects;

        res.render("pages/index", { data: data });
    } catch (e) {
        console.log(e);
    }
});


app.listen(8080);
console.log("8080 is the magic port");