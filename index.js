const request = require("request")
const fs = require('fs')
const express = require("express");
const app = express()
const emails = require("./json/emails.json")
const nodemailer = require("nodemailer")

app.set("view-engine", "ejs")

app.use(express.urlencoded({ extended: false}))

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

// apply rate limiter to all requests
app.use(limiter);


app.get("/", function (req, res) {
    res.render(__dirname + "/views/index.ejs", {})
})

app.post("/",  function (req, res) {
    const email = req.body.email
    if (emails.includes(email)) {
      res.render(__dirname + "/views/message.ejs", { message: "Tato emailová adresa je již zaregistrovaná."})
    } else {
      emails.push(email)
      const emailsStringified = JSON.stringify(emails)
      fs.writeFileSync("./json/emails.json", emailsStringified, "utf-8")
      res.render(__dirname + "/views/message.ejs", { message: "Tvá emailová adresa byla úspěšně zaregistrovaná!"})
    }
})

app.get("/delaccount", function (req, res) {
  res.render(__dirname + "/views/cancelemail.ejs")
})

app.post("/delaccount", function (req, res) {
  const email = req.body.email
  if (emails.includes(email)) {
    const newemails = emails.filter((e) => e !== email)
    const emailsStringified = JSON.stringify(newemails)
    fs.writeFileSync("./json/emails.json", emailsStringified, "utf-8")
    res.render(__dirname + "/views/message.ejs", { message: "Tvá emailová adresa byla úspěšně odebrána."})
  } else {
    res.render(__dirname + "/views/message.ejs", { message: "Tato emailová adresa není zaregistrovaná."})
  }
})

const transporter = nodemailer.createTransport({
  host: process.env.mailHost,
  port: parseInt(process.env.mailPort) ,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPass
  }
})

setInterval( function () {
const cookieJar = request.jar();
const datevar = new Date()
const day = datevar.getDate()
const month = datevar.getMonth() + 1
const date = `${day}. ${month}.`

request({url: 'https://www.mujkaktus.cz/', jar: cookieJar}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
   if (body.includes(date)) {
        transporter.sendMail({
          from: {
            name: "Kaktus-Checker",
            address: process.env.mailUser
          },
          bcc: emails,
          subject: "Kaktus Sleva",
          html: `Ahoj,<br>mám pro tebe dobré zprávy. Operátor MůjKaktus má dnes ${date} slevu na kredit.<br><br.Tato zpráva byla odeslána automaticky, neodpovídejte na ni prosím.<br>Jestliže chcete zrušit posílání těchto emailů klikněte <a href="https://kaktus.daneeskripter.dev/delaccount">zde</a> <br><br>MailBot,<br>Kaktus-checker`
        }, function (error, info) {
          if (error) {
            console.log(error)
          } else {
            console.log("Emaily odeslany")
          }
        })
    }
  }
});

}, 7200000)


app.get("/*", function (req, res) {
  res.render(__dirname + "/views/message.ejs", {message: "Chyba 404 - Tato stránka neexistuje"})
})

app.listen(4000)
console.log("App listening on port 4000")