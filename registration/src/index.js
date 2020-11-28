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
    
        let updateRequest = http.request({
            hostname : "bot",
            port : 8080,
            path: `/?requestId=${id}`,
            method: "POST",
        }, res => {
        })
    
        updateRequest.on("response", (response) => {
            if (response.statusCode == 200) {
                res.send("Erfolgreich eingeloggt.");
            } else {
                res.send("Etwas ist schief gelaufen! Status: " + response.statusCode + " " + response.statusMessage);
            }
        })
        updateRequest.end();
    } catch (err) {
        res.send("Etwas ist schief gelaufen! \n" + err);
    }
    
});

app.post("/*", (req, res) => {
    console.log("Headers:")
    console.log(req.headers)
    console.log("body:")
    console.log(req.body)
})


app.listen(9897);