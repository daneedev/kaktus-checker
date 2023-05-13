const request = require("request")
const fs = require('fs')
const express = require("express");
const app = express()
const emails = require("./json/emails.json")

app.set("view-engine", "ejs")

app.get("/", function (req, res) {
    res.render(__dirname + "/views/index.ejs")
})

app.post("/", function (req, res) {
    const email = req.body.mail
    console.log(email)
    emails.push(email)
})
/*
const cookieJar = request.jar();
const datevar = new Date()
const day = datevar.getDate()
const month = datevar.getMonth() + 1
const date = `${day}. ${month}.`
console.log(date)

request({url: 'https://www.mujkaktus.cz/', jar: cookieJar}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    if (body.includes(date)) {
        
    }
  }
});
*/
app.listen(4000)
console.log("App listening on port 4000")