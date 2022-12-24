const express = require('express');
const bodyParser = require("body-parser");

const subjectRoutes = require('./src/routes/api/subjectsRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use("/api", subjectRoutes);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("pages/index");
});

app.listen(8080);
console.log("8080 is the magic port");