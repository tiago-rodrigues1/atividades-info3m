const express = require('express');
const axios = require('axios').default;
const bodyParser = require('body-parser');

const subjectRoutes = require('./src/routes/api/subjectsRoutes');
const activitiesRoutes = require('./src/routes/api/activitiesRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use("/api", subjectRoutes);
app.use("/api", activitiesRoutes);

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    const { data } = await axios.get("http://localhost:8080/api/activities");
    res.render("pages/index", {
        data: data
    });
});

app.listen(8080);
console.log("8080 is the magic port");