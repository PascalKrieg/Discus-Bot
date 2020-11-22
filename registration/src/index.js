const express = require("express");
const app = express();
const database = require("./database")

let db = new database()

app.get("/register", (req, res) => {
    console.log(req.query);
    db.addCode(req.query.state, req.query.code)
    res.send("Erfolgreich eingeloggt.");
});

app.listen(9897);