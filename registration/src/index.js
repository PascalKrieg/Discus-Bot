const express = require("express");
const app = express();

app.get("/", (req, res) => {
    console.log(req);
    res.send("Erfolgreich eingeloggt.");
});


app.listen(9897);


/*
const https = require("https");

https.request({
    hostname : "link.tospotify.com",
    port : 443,
    path : "/qZcPGKvChab",
    method : "GET",
}, (res) => {
    console.log(res.headers)
}).end();
*/