const express = require("express");
const app = express();
const database = require("./database")
const http = require("http")


app.get("/register", async (req, res) => {
    try {
        if (req.query.error) {
            // todo: xss?
            res.send("Error: " + req.query.error)
        }
        let id = await database.addCode(req.query.state, req.query.code);
    
        console.log(id)
    
        http.request({
            hostname : "bot",
            port : 8080,
            path: `/?requestId=${id}`,
            method: "POST",
        }, res => {}).end();
    
        res.send("Erfolgreich eingeloggt.");
    } catch (err) {
        res.send("Etwas ist schief gelaufen!")
    }
    
});

app.listen(9897);